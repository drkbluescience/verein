using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.MitgliedAdresse;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Mitglied business operations
/// </summary>
public class MitgliedService : IMitgliedService
{
    private const int BeitragZahlungTypId = 1;
    private const int ForderungStatusPaid = 1;
    private const int ForderungStatusUnpaid = 2;

    private readonly IMitgliedRepository _mitgliedRepository;
    private readonly IMitgliedAdresseRepository _mitgliedAdresseRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedService> _logger;
    private readonly ApplicationDbContext _context;

    public MitgliedService(
        IMitgliedRepository mitgliedRepository,
        IMitgliedAdresseRepository mitgliedAdresseRepository,
        IMapper mapper,
        ILogger<MitgliedService> logger,
        ApplicationDbContext context)
    {
        _mitgliedRepository = mitgliedRepository;
        _mitgliedAdresseRepository = mitgliedAdresseRepository;
        _mapper = mapper;
        _logger = logger;
        _context = context;
    }

    #region CRUD Operations

    public async Task<MitgliedDto> CreateAsync(CreateMitgliedDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new mitglied with number {MitgliedNumber}", createDto.Mitgliedsnummer);

        // Validate business rules
        var validationResult = await ValidateCreateAsync(createDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
        }

        try
        {
            var mitglied = _mapper.Map<Mitglied>(createDto);
            mitglied.Created = DateTime.UtcNow;
            mitglied.CreatedBy = 1; // TODO: Get from current user context

            var createdMitglied = await _mitgliedRepository.AddAsync(mitglied, cancellationToken);
            
            _logger.LogInformation("Successfully created mitglied with ID {MitgliedId}", createdMitglied.Id);
            
            return _mapper.Map<MitgliedDto>(createdMitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating mitglied with number {MitgliedNumber}", createDto.Mitgliedsnummer);
            throw;
        }
    }

    public async Task<MitgliedDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglied by ID {MitgliedId}", id);

        var mitglied = await _mitgliedRepository.GetByIdAsync(id, false, cancellationToken);
        return mitglied != null ? _mapper.Map<MitgliedDto>(mitglied) : null;
    }

    public async Task<IEnumerable<MitgliedDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all mitglieder, includeDeleted: {IncludeDeleted}", includeDeleted);

        var mitglieder = await _mitgliedRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<MitgliedDto> UpdateAsync(int id, UpdateMitgliedDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating mitglied with ID {MitgliedId}", id);

        // Validate business rules
        var validationResult = await ValidateUpdateAsync(id, updateDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
        }

        try
        {
            var existingMitglied = await _mitgliedRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingMitglied == null)
            {
                throw new ArgumentException($"Mitglied with ID {id} not found");
            }

            var previousPeriodeCode = existingMitglied.BeitragPeriodeCode;
            var previousZahlungsTag = existingMitglied.BeitragZahlungsTag;
            var previousZahlungstagTyp = existingMitglied.BeitragZahlungstagTypCode;

            _mapper.Map(updateDto, existingMitglied);
            existingMitglied.Modified = DateTime.UtcNow;
            existingMitglied.ModifiedBy = 1; // TODO: Get from current user context

            var updatedMitglied = await _mitgliedRepository.UpdateAsync(existingMitglied, cancellationToken);

            var planChanged = !string.Equals(previousPeriodeCode, updatedMitglied.BeitragPeriodeCode, StringComparison.OrdinalIgnoreCase)
                || previousZahlungsTag != updatedMitglied.BeitragZahlungsTag
                || !string.Equals(previousZahlungstagTyp, updatedMitglied.BeitragZahlungstagTypCode, StringComparison.OrdinalIgnoreCase);

            if (planChanged)
            {
                await ReplanBeitragForderungenAsync(updatedMitglied, DateTime.UtcNow.Date, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated mitglied with ID {MitgliedId}", id);
            
            return _mapper.Map<MitgliedDto>(updatedMitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating mitglied with ID {MitgliedId}", id);
            throw;
        }
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting mitglied with ID {MitgliedId}", id);

        try
        {
            await _mitgliedRepository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted mitglied with ID {MitgliedId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting mitglied with ID {MitgliedId}", id);
            throw;
        }
    }

    public async Task<PagedResult<MitgliedDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged mitglieder, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _mitgliedRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<MitgliedDto>
        {
            Items = _mapper.Map<IEnumerable<MitgliedDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Business Operations

    public async Task<MitgliedDto> CreateWithAddressAsync(CreateMitgliedDto mitgliedDto, CreateMitgliedAdresseDto adresseDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating mitglied with address, member number: {MitgliedNumber}", mitgliedDto.Mitgliedsnummer);

        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Create mitglied first
            var createdMitglied = await CreateAsync(mitgliedDto, cancellationToken);

            // Create address
            adresseDto.MitgliedId = createdMitglied.Id;
            adresseDto.IstStandard = true; // First address is always standard

            var adresse = _mapper.Map<MitgliedAdresse>(adresseDto);
            adresse.Created = DateTime.UtcNow;
            adresse.CreatedBy = 1; // TODO: Get from current user context

            await _mitgliedAdresseRepository.AddAsync(adresse, cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Successfully created mitglied with address, ID: {MitgliedId}", createdMitglied.Id);

            // Return mitglied with addresses
            return await GetWithAddressesAsync(createdMitglied.Id, cancellationToken) ?? createdMitglied;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error creating mitglied with address");
            throw;
        }
    }

    public async Task<MitgliedDto?> GetFullAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting full mitglied data for ID {MitgliedId}", id);

        var mitglied = await _mitgliedRepository.GetFullAsync(id, cancellationToken);
        return mitglied != null ? _mapper.Map<MitgliedDto>(mitglied) : null;
    }

    public async Task<MitgliedDto?> GetWithAddressesAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglied with addresses for ID {MitgliedId}", id);

        var mitglied = await _mitgliedRepository.GetWithAddressesAsync(id, cancellationToken);
        return mitglied != null ? _mapper.Map<MitgliedDto>(mitglied) : null;
    }

    public async Task<MitgliedDto?> GetWithFamilyAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglied with family for ID {MitgliedId}", id);

        var mitglied = await _mitgliedRepository.GetWithFamilyAsync(id, cancellationToken);
        return mitglied != null ? _mapper.Map<MitgliedDto>(mitglied) : null;
    }

    public async Task<MitgliedDto> TransferToVereinAsync(int mitgliedId, int newVereinId, DateTime transferDate, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Transferring mitglied {MitgliedId} to verein {VereinId}", mitgliedId, newVereinId);

        try
        {
            var mitglied = await _mitgliedRepository.GetByIdAsync(mitgliedId, false, cancellationToken);
            if (mitglied == null)
            {
                throw new ArgumentException($"Mitglied with ID {mitgliedId} not found");
            }

            var oldVereinId = mitglied.VereinId;
            mitglied.VereinId = newVereinId;
            mitglied.Eintrittsdatum = transferDate;
            mitglied.Modified = DateTime.UtcNow;
            mitglied.ModifiedBy = 1; // TODO: Get from current user context

            var updatedMitglied = await _mitgliedRepository.UpdateAsync(mitglied, cancellationToken);

            _logger.LogInformation("Successfully transferred mitglied {MitgliedId} from verein {OldVereinId} to {NewVereinId}", 
                mitgliedId, oldVereinId, newVereinId);

            return _mapper.Map<MitgliedDto>(updatedMitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error transferring mitglied {MitgliedId} to verein {VereinId}", mitgliedId, newVereinId);
            throw;
        }
    }

    public async Task<MitgliedDto> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting active status for mitglied {MitgliedId} to {IsActive}", id, isActive);

        try
        {
            var mitglied = await _mitgliedRepository.GetByIdAsync(id, false, cancellationToken);
            if (mitglied == null)
            {
                throw new ArgumentException($"Mitglied with ID {id} not found");
            }

            mitglied.Aktiv = isActive;
            mitglied.Modified = DateTime.UtcNow;
            mitglied.ModifiedBy = 1; // TODO: Get from current user context

            if (!isActive)
            {
                mitglied.Austrittsdatum = DateTime.Now.Date;
            }
            else
            {
                mitglied.Austrittsdatum = null;
            }

            var updatedMitglied = await _mitgliedRepository.UpdateAsync(mitglied, cancellationToken);

            _logger.LogInformation("Successfully set active status for mitglied {MitgliedId} to {IsActive}", id, isActive);

            return _mapper.Map<MitgliedDto>(updatedMitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting active status for mitglied {MitgliedId}", id);
            throw;
        }
    }

    #endregion

    #region Search and Filter Operations

    public async Task<IEnumerable<MitgliedDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglieder by verein ID {VereinId}", vereinId);

        var mitglieder = await _mitgliedRepository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> SearchByNameAsync(string? vorname, string? nachname, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Searching mitglieder by name: {Vorname} {Nachname}", vorname, nachname);

        var mitglieder = await _mitgliedRepository.SearchByNameAsync(vorname, nachname, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglieder by email {Email}", email);

        var mitglieder = await _mitgliedRepository.GetByEmailAsync(email, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> GetActiveMitgliederAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active mitglieder for verein {VereinId}", vereinId);

        var mitglieder = await _mitgliedRepository.GetActiveMitgliederAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglieder by status {StatusId}", statusId);

        var mitglieder = await _mitgliedRepository.GetByStatusAsync(statusId, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> GetByTypAsync(int typId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglieder by type {TypId}", typId);

        var mitglieder = await _mitgliedRepository.GetByTypAsync(typId, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> GetByJoinDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglieder by join date range {FromDate} - {ToDate}", fromDate, toDate);

        var mitglieder = await _mitgliedRepository.GetByJoinDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    public async Task<IEnumerable<MitgliedDto>> GetByBirthdayRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglieder by birthday range {FromDate} - {ToDate}", fromDate, toDate);

        var mitglieder = await _mitgliedRepository.GetByBirthdayRangeAsync(fromDate, toDate, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedDto>>(mitglieder);
    }

    #endregion

    #region Validation Operations

    public async Task<bool> IsMitgliedsnummerUniqueAsync(string mitgliedsnummer, int vereinId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if mitgliedsnummer {MitgliedNumber} is unique in verein {VereinId}", mitgliedsnummer, vereinId);

        return await _mitgliedRepository.IsMitgliedsnummerUniqueAsync(mitgliedsnummer, vereinId, excludeId, cancellationToken);
    }

    public async Task<ValidationResult> ValidateCreateAsync(CreateMitgliedDto createDto, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        // Check required fields
        if (string.IsNullOrWhiteSpace(createDto.Vorname))
        {
            result.Errors.Add("Vorname ist erforderlich");
        }

        if (string.IsNullOrWhiteSpace(createDto.Nachname))
        {
            result.Errors.Add("Nachname ist erforderlich");
        }

        if (string.IsNullOrWhiteSpace(createDto.Mitgliedsnummer))
        {
            result.Errors.Add("Mitgliedsnummer ist erforderlich");
        }

        if (createDto.VereinId <= 0)
        {
            result.Errors.Add("VereinId ist erforderlich");
        }

        // Check unique constraints
        if (!string.IsNullOrWhiteSpace(createDto.Mitgliedsnummer) && createDto.VereinId > 0)
        {
            var isUnique = await IsMitgliedsnummerUniqueAsync(createDto.Mitgliedsnummer, createDto.VereinId, null, cancellationToken);
            if (!isUnique)
            {
                result.Errors.Add($"Mitgliedsnummer '{createDto.Mitgliedsnummer}' ist bereits in diesem Verein vergeben");
            }
        }

        // Validate email format
        if (!string.IsNullOrWhiteSpace(createDto.Email) && !IsValidEmail(createDto.Email))
        {
            result.Errors.Add("Email-Format ist ungültig");
        }

        // Validate dates
        if (createDto.Geburtsdatum.HasValue && createDto.Geburtsdatum.Value > DateTime.Now.Date)
        {
            result.Errors.Add("Geburtsdatum kann nicht in der Zukunft liegen");
        }

        if (createDto.Eintrittsdatum.HasValue && createDto.Austrittsdatum.HasValue &&
            createDto.Eintrittsdatum.Value > createDto.Austrittsdatum.Value)
        {
            result.Errors.Add("Eintrittsdatum kann nicht nach dem Austrittsdatum liegen");
        }

        // Validate contribution amount
        if (createDto.BeitragBetrag.HasValue && createDto.BeitragBetrag.Value < 0)
        {
            result.Errors.Add("Beitragsbetrag kann nicht negativ sein");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    public async Task<ValidationResult> ValidateUpdateAsync(int id, UpdateMitgliedDto updateDto, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        // Check if mitglied exists
        var existingMitglied = await _mitgliedRepository.GetByIdAsync(id, false, cancellationToken);
        if (existingMitglied == null)
        {
            result.Errors.Add($"Mitglied mit ID {id} nicht gefunden");
            result.IsValid = false;
            return result;
        }

        // Check unique constraints if mitgliedsnummer is being updated
        if (!string.IsNullOrWhiteSpace(updateDto.Mitgliedsnummer) &&
            updateDto.Mitgliedsnummer != existingMitglied.Mitgliedsnummer)
        {
            var isUnique = await IsMitgliedsnummerUniqueAsync(updateDto.Mitgliedsnummer, existingMitglied.VereinId, id, cancellationToken);
            if (!isUnique)
            {
                result.Errors.Add($"Mitgliedsnummer '{updateDto.Mitgliedsnummer}' ist bereits in diesem Verein vergeben");
            }
        }

        // Validate email format
        if (!string.IsNullOrWhiteSpace(updateDto.Email) && !IsValidEmail(updateDto.Email))
        {
            result.Errors.Add("Email-Format ist ungültig");
        }

        // Validate dates
        if (updateDto.Geburtsdatum.HasValue && updateDto.Geburtsdatum.Value > DateTime.Now.Date)
        {
            result.Errors.Add("Geburtsdatum kann nicht in der Zukunft liegen");
        }

        var eintrittsdatum = updateDto.Eintrittsdatum ?? existingMitglied.Eintrittsdatum;
        var austrittsdatum = updateDto.Austrittsdatum ?? existingMitglied.Austrittsdatum;

        if (eintrittsdatum.HasValue && austrittsdatum.HasValue &&
            eintrittsdatum.Value > austrittsdatum.Value)
        {
            result.Errors.Add("Eintrittsdatum kann nicht nach dem Austrittsdatum liegen");
        }

        // Validate contribution amount
        if (updateDto.BeitragBetrag.HasValue && updateDto.BeitragBetrag.Value < 0)
        {
            result.Errors.Add("Beitragsbetrag kann nicht negativ sein");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    #endregion

    #region Statistics Operations

    public async Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting count of mitglieder for verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _mitgliedRepository.GetCountByVereinAsync(vereinId, activeOnly, cancellationToken);
    }

    public async Task<MembershipStatistics> GetMembershipStatisticsAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting membership statistics for verein {VereinId}", vereinId);

        try
        {
            var allMembers = await _mitgliedRepository.GetByVereinIdAsync(vereinId, true, cancellationToken);
            var activeMembers = allMembers.Where(m => m.Aktiv == true);
            var inactiveMembers = allMembers.Where(m => m.Aktiv != true);

            var currentMonth = DateTime.Now.Date.AddDays(-DateTime.Now.Day + 1);
            var currentYear = new DateTime(DateTime.Now.Year, 1, 1);

            var newMembersThisMonth = allMembers.Count(m =>
                m.Eintrittsdatum.HasValue && m.Eintrittsdatum.Value >= currentMonth);

            var newMembersThisYear = allMembers.Count(m =>
                m.Eintrittsdatum.HasValue && m.Eintrittsdatum.Value >= currentYear);

            var membersByStatus = allMembers
                .GroupBy(m => m.MitgliedStatusId)
                .ToDictionary(g => g.Key, g => g.Count());

            var membersByType = allMembers
                .GroupBy(m => m.MitgliedTypId)
                .ToDictionary(g => g.Key, g => g.Count());

            return new MembershipStatistics
            {
                TotalMembers = allMembers.Count(),
                ActiveMembers = activeMembers.Count(),
                InactiveMembers = inactiveMembers.Count(),
                NewMembersThisMonth = newMembersThisMonth,
                NewMembersThisYear = newMembersThisYear,
                MembersByStatus = membersByStatus,
                MembersByType = membersByType
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting membership statistics for verein {VereinId}", vereinId);
            throw;
        }
    }

    #endregion

    #region Beitrag Replanning

    private async Task ReplanBeitragForderungenAsync(Mitglied mitglied, DateTime effectiveDate, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(mitglied.BeitragPeriodeCode))
        {
            _logger.LogDebug("Skipping replanning for Mitglied {MitgliedId} - no period code", mitglied.Id);
            return;
        }

        if (!mitglied.BeitragBetrag.HasValue || mitglied.BeitragBetrag.Value <= 0)
        {
            _logger.LogDebug("Skipping replanning for Mitglied {MitgliedId} - no amount", mitglied.Id);
            return;
        }

        if (!mitglied.BeitragWaehrungId.HasValue)
        {
            _logger.LogDebug("Skipping replanning for Mitglied {MitgliedId} - no currency", mitglied.Id);
            return;
        }

        var monthsPerPeriod = GetMonthsPerPeriod(mitglied.BeitragPeriodeCode);
        if (monthsPerPeriod <= 0)
        {
            _logger.LogDebug("Skipping replanning for Mitglied {MitgliedId} - unsupported period {PeriodCode}", mitglied.Id, mitglied.BeitragPeriodeCode);
            return;
        }

        var forderungen = await _context.MitgliedForderungen
            .Where(f => f.MitgliedId == mitglied.Id && f.ZahlungTypId == BeitragZahlungTypId && f.DeletedFlag != true)
            .ToListAsync(cancellationToken);

        var paidThrough = forderungen
            .Where(f => f.StatusId == ForderungStatusPaid)
            .Select(f => f.Faelligkeit.Date)
            .DefaultIfEmpty(DateTime.MinValue)
            .Max();

        var anchorDate = paidThrough > effectiveDate ? paidThrough : effectiveDate;
        var paymentDay = mitglied.BeitragZahlungsTag ?? 1;
        var useLastDay = string.Equals(mitglied.BeitragZahlungstagTypCode, "LAST_DAY", StringComparison.OrdinalIgnoreCase);

        var firstDue = AlignPaymentDay(anchorDate, paymentDay, useLastDay);
        if (firstDue < anchorDate)
        {
            firstDue = AlignPaymentDay(anchorDate.AddMonths(monthsPerPeriod), paymentDay, useLastDay);
        }

        if (paidThrough != DateTime.MinValue && firstDue < paidThrough)
        {
            firstDue = paidThrough;
        }

        var forderungIds = forderungen.Select(f => f.Id).ToList();
        var allocatedForderungIds = await _context.MitgliedForderungZahlungen
            .Where(fz => forderungIds.Contains(fz.ForderungId) && fz.DeletedFlag != true)
            .Select(fz => fz.ForderungId)
            .Distinct()
            .ToListAsync(cancellationToken);
        var directPaymentIds = await _context.MitgliedZahlungen
            .Where(z => z.ForderungId.HasValue && forderungIds.Contains(z.ForderungId.Value) && z.DeletedFlag != true)
            .Select(z => z.ForderungId!.Value)
            .Distinct()
            .ToListAsync(cancellationToken);
        var allocatedSet = new HashSet<int>(allocatedForderungIds);
        foreach (var id in directPaymentIds)
        {
            allocatedSet.Add(id);
        }

        var replacedForderungen = forderungen
            .Where(f => f.StatusId != ForderungStatusPaid
                && f.Faelligkeit.Date >= anchorDate
                && !allocatedSet.Contains(f.Id))
            .ToList();

        foreach (var forderung in replacedForderungen)
        {
            forderung.DeletedFlag = true;
            forderung.Modified = DateTime.UtcNow;
            forderung.ModifiedBy = 1;
        }

        var existingKeys = new HashSet<string>(
            forderungen
                .Where(f => !replacedForderungen.Contains(f))
                .Select(f => GetPeriodKey(f.Faelligkeit, monthsPerPeriod)));

        var newForderungen = new List<MitgliedForderung>();
        var periodsToGenerate = GetPeriodsToGenerate(monthsPerPeriod);
        var dueDate = firstDue;

        for (var i = 0; i < periodsToGenerate; i++)
        {
            if (i > 0)
            {
                dueDate = AlignPaymentDay(dueDate.AddMonths(monthsPerPeriod), paymentDay, useLastDay);
            }

            var key = GetPeriodKey(dueDate, monthsPerPeriod);
            if (existingKeys.Contains(key))
            {
                continue;
            }

            var newForderung = new MitgliedForderung
            {
                VereinId = mitglied.VereinId,
                MitgliedId = mitglied.Id,
                ZahlungTypId = BeitragZahlungTypId,
                Betrag = mitglied.BeitragBetrag.Value,
                WaehrungId = mitglied.BeitragWaehrungId.Value,
                Faelligkeit = dueDate.Date,
                Beschreibung = BuildBeschreibung(dueDate, monthsPerPeriod),
                StatusId = ForderungStatusUnpaid,
                Created = DateTime.UtcNow,
                CreatedBy = 1
            };

            ApplyPeriodFields(newForderung, dueDate, monthsPerPeriod);
            newForderungen.Add(newForderung);
            existingKeys.Add(key);
        }

        if (newForderungen.Count > 0)
        {
            await _context.MitgliedForderungen.AddRangeAsync(newForderungen, cancellationToken);
        }

        _logger.LogInformation(
            "Replanned Beitrag for Mitglied {MitgliedId}: removed {RemovedCount}, added {AddedCount}",
            mitglied.Id,
            replacedForderungen.Count,
            newForderungen.Count);
    }

    private static int GetMonthsPerPeriod(string? code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return 0;
        }

        return code.Trim().ToUpperInvariant() switch
        {
            "YEARLY" => 12,
            "QUARTERLY" => 3,
            "SEMIANNUAL" => 6,
            "HALF_YEAR" => 6,
            _ => 1
        };
    }

    private static int GetPeriodsToGenerate(int monthsPerPeriod)
    {
        return monthsPerPeriod switch
        {
            12 => 1,
            6 => 2,
            3 => 4,
            _ => 12
        };
    }

    private static DateTime AlignPaymentDay(DateTime baseDate, int paymentDay, bool useLastDay)
    {
        var day = useLastDay
            ? DateTime.DaysInMonth(baseDate.Year, baseDate.Month)
            : Math.Min(paymentDay, DateTime.DaysInMonth(baseDate.Year, baseDate.Month));

        return new DateTime(baseDate.Year, baseDate.Month, day);
    }

    private static string GetPeriodKey(DateTime dueDate, int monthsPerPeriod)
    {
        return monthsPerPeriod switch
        {
            12 => $"Y{dueDate.Year}",
            6 => $"H{dueDate.Year}-{GetHalfYear(dueDate)}",
            3 => $"Q{dueDate.Year}-{GetQuarter(dueDate)}",
            _ => $"{dueDate.Year}-{dueDate.Month:D2}"
        };
    }

    private static string BuildBeschreibung(DateTime dueDate, int monthsPerPeriod)
    {
        return monthsPerPeriod switch
        {
            12 => $"Year {dueDate.Year}",
            6 => $"Half {GetHalfYear(dueDate)} {dueDate.Year}",
            3 => $"Q{GetQuarter(dueDate)} {dueDate.Year}",
            _ => $"{dueDate.Year}/{dueDate.Month:D2}"
        };
    }

    private static int GetQuarter(DateTime date)
    {
        return ((date.Month - 1) / 3) + 1;
    }

    private static int GetHalfYear(DateTime date)
    {
        return ((date.Month - 1) / 6) + 1;
    }

    private static void ApplyPeriodFields(MitgliedForderung forderung, DateTime dueDate, int monthsPerPeriod)
    {
        forderung.Jahr = dueDate.Year;

        if (monthsPerPeriod == 12)
        {
            forderung.Monat = null;
            forderung.Quartal = null;
            return;
        }

        forderung.Monat = dueDate.Month;
        forderung.Quartal = monthsPerPeriod == 3 ? GetQuarter(dueDate) : null;
    }

    #endregion
}
