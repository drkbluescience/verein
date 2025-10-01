using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.Veranstaltung;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Veranstaltung business operations
/// </summary>
public class VeranstaltungService : IVeranstaltungService
{
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly IRepository<VeranstaltungAnmeldung> _anmeldungRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<VeranstaltungService> _logger;

    public VeranstaltungService(
        IRepository<Veranstaltung> veranstaltungRepository,
        IRepository<VeranstaltungAnmeldung> anmeldungRepository,
        IMapper mapper,
        ILogger<VeranstaltungService> logger)
    {
        _veranstaltungRepository = veranstaltungRepository;
        _anmeldungRepository = anmeldungRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<VeranstaltungDto> CreateAsync(CreateVeranstaltungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new veranstaltung {Title} for Verein {VereinId}", createDto.Titel, createDto.VereinId);

        try
        {
            // Validate business rules
            await ValidateCreateAsync(createDto, cancellationToken);

            var veranstaltung = _mapper.Map<Veranstaltung>(createDto);
            
            var createdVeranstaltung = await _veranstaltungRepository.AddAsync(veranstaltung, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created veranstaltung with ID {VeranstaltungId}", createdVeranstaltung.Id);
            return _mapper.Map<VeranstaltungDto>(createdVeranstaltung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating veranstaltung {Title}", createDto.Titel);
            throw;
        }
    }

    public async Task<VeranstaltungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltung by ID {VeranstaltungId}", id);

        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
        return veranstaltung != null ? _mapper.Map<VeranstaltungDto>(veranstaltung) : null;
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all veranstaltungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var veranstaltungen = await _veranstaltungRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<VeranstaltungDto> UpdateAsync(int id, UpdateVeranstaltungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating veranstaltung {VeranstaltungId}", id);

        try
        {
            var existingVeranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingVeranstaltung == null)
            {
                throw new ArgumentException($"Veranstaltung with ID {id} not found");
            }

            // Validate business rules
            await ValidateUpdateAsync(id, updateDto, cancellationToken);

            _mapper.Map(updateDto, existingVeranstaltung);
            
            var updatedVeranstaltung = await _veranstaltungRepository.UpdateAsync(existingVeranstaltung, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated veranstaltung {VeranstaltungId}", id);
            return _mapper.Map<VeranstaltungDto>(updatedVeranstaltung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating veranstaltung {VeranstaltungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting veranstaltung {VeranstaltungId}", id);

        try
        {
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
            if (veranstaltung == null)
            {
                _logger.LogWarning("Veranstaltung {VeranstaltungId} not found for deletion", id);
                return false;
            }

            await _veranstaltungRepository.DeleteAsync(veranstaltung, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft deleted veranstaltung {VeranstaltungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting veranstaltung {VeranstaltungId}", id);
            throw;
        }
    }

    public async Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("Hard deleting veranstaltung {VeranstaltungId}", id);

        try
        {
            await _veranstaltungRepository.HardDeleteAsync(id, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully hard deleted veranstaltung {VeranstaltungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hard deleting veranstaltung {VeranstaltungId}", id);
            throw;
        }
    }

    #endregion

    #region Query Operations

    public async Task<IEnumerable<VeranstaltungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltungen for Verein {VereinId}", vereinId);

        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => v.VereinId == vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> SearchByTitleAsync(string title, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Searching veranstaltungen by title {Title}", title);

        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => v.Titel.Contains(title), false, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltungen by date range {StartDate} - {EndDate}", startDate, endDate);

        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => 
            v.Startdatum >= startDate && v.Startdatum <= endDate &&
            (vereinId == null || v.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetUpcomingAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting upcoming veranstaltungen");

        var now = DateTime.Now;
        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => 
            v.Startdatum > now &&
            (vereinId == null || v.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetPastAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting past veranstaltungen");

        var now = DateTime.Now;
        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => 
            v.Startdatum <= now &&
            (vereinId == null || v.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetActiveAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active veranstaltungen");

        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => 
            v.Aktiv == true &&
            (vereinId == null || v.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetRequiringRegistrationAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltungen requiring registration");

        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => 
            v.AnmeldeErforderlich == true &&
            (vereinId == null || v.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<IEnumerable<VeranstaltungDto>> GetByLocationAsync(string location, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltungen by location {Location}", location);

        var veranstaltungen = await _veranstaltungRepository.GetAsync(v => v.Ort != null && v.Ort.Contains(location), false, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungDto>>(veranstaltungen);
    }

    public async Task<VeranstaltungDto?> GetFullDetailsAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltung with full details {VeranstaltungId}", id);

        // For now, return basic details - would need to implement includes for full details
        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
        return veranstaltung != null ? _mapper.Map<VeranstaltungDto>(veranstaltung) : null;
    }

    #endregion

    #region Business Operations

    public async Task<bool> IsTitleUniqueAsync(string title, int vereinId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking title uniqueness for {Title} in Verein {VereinId}", title, vereinId);

        var existingVeranstaltung = await _veranstaltungRepository.GetFirstOrDefaultAsync(v =>
            v.Titel == title && v.VereinId == vereinId &&
            (excludeId == null || v.Id != excludeId),
            true, cancellationToken);

        return existingVeranstaltung == null;
    }

    public async Task<int> GetRegistrationCountAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting registration count for veranstaltung {VeranstaltungId}, activeOnly: {ActiveOnly}", veranstaltungId, activeOnly);

        return await _anmeldungRepository.CountAsync(a =>
            a.VeranstaltungId == veranstaltungId &&
            (!activeOnly || a.Aktiv == true),
            false, cancellationToken);
    }

    public async Task<int?> GetAvailableCapacityAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting available capacity for veranstaltung {VeranstaltungId}", veranstaltungId);

        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId, false, cancellationToken);
        if (veranstaltung == null || !veranstaltung.MaxTeilnehmer.HasValue)
        {
            return null; // Unlimited capacity
        }

        var registrationCount = await GetRegistrationCountAsync(veranstaltungId, true, cancellationToken);
        return Math.Max(0, veranstaltung.MaxTeilnehmer.Value - registrationCount);
    }

    public async Task<bool> HasAvailableCapacityAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        var availableCapacity = await GetAvailableCapacityAsync(veranstaltungId, cancellationToken);
        return availableCapacity == null || availableCapacity > 0;
    }

    public async Task<bool> IsRegistrationOpenAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if registration is open for veranstaltung {VeranstaltungId}", veranstaltungId);

        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId, false, cancellationToken);
        if (veranstaltung == null)
        {
            return false;
        }

        var now = DateTime.Now;
        return veranstaltung.AnmeldeErforderlich == true &&
               (veranstaltung.Aktiv == true || veranstaltung.Aktiv == null) &&
               veranstaltung.Startdatum > now &&
               await HasAvailableCapacityAsync(veranstaltungId, cancellationToken);
    }

    public async Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Activating veranstaltung {VeranstaltungId}", id);

        try
        {
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
            if (veranstaltung == null)
            {
                return false;
            }

            veranstaltung.Aktiv = true;
            await _veranstaltungRepository.UpdateAsync(veranstaltung, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully activated veranstaltung {VeranstaltungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error activating veranstaltung {VeranstaltungId}", id);
            throw;
        }
    }

    public async Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deactivating veranstaltung {VeranstaltungId}", id);

        try
        {
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
            if (veranstaltung == null)
            {
                return false;
            }

            veranstaltung.Aktiv = false;
            await _veranstaltungRepository.UpdateAsync(veranstaltung, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully deactivated veranstaltung {VeranstaltungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deactivating veranstaltung {VeranstaltungId}", id);
            throw;
        }
    }

    public async Task<bool> CancelAsync(int id, string? reason = null, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Cancelling veranstaltung {VeranstaltungId} with reason: {Reason}", id, reason);

        try
        {
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id, false, cancellationToken);
            if (veranstaltung == null)
            {
                return false;
            }

            veranstaltung.Aktiv = false;
            // Note: Would need to add cancellation fields to entity if needed
            await _veranstaltungRepository.UpdateAsync(veranstaltung, cancellationToken);
            await _veranstaltungRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully cancelled veranstaltung {VeranstaltungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling veranstaltung {VeranstaltungId}", id);
            throw;
        }
    }

    #endregion

    #region Statistics

    public async Task<object> GetStatisticsAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting statistics for veranstaltung {VeranstaltungId}", veranstaltungId);

        try
        {
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId, false, cancellationToken);
            if (veranstaltung == null)
            {
                throw new ArgumentException($"Veranstaltung with ID {veranstaltungId} not found");
            }

            var registrationCount = await GetRegistrationCountAsync(veranstaltungId, true, cancellationToken);
            var availableCapacity = await GetAvailableCapacityAsync(veranstaltungId, cancellationToken);
            var isRegistrationOpen = await IsRegistrationOpenAsync(veranstaltungId, cancellationToken);

            return new
            {
                VeranstaltungId = veranstaltungId,
                Title = veranstaltung.Titel,
                RegistrationCount = registrationCount,
                MaxCapacity = veranstaltung.MaxTeilnehmer,
                AvailableCapacity = availableCapacity,
                IsRegistrationOpen = isRegistrationOpen,
                StartDate = veranstaltung.Startdatum,
                EndDate = veranstaltung.Enddatum,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics for veranstaltung {VeranstaltungId}", veranstaltungId);
            throw;
        }
    }

    public async Task<object> GetVereinEventStatisticsAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting event statistics for verein {VereinId}", vereinId);

        try
        {
            var totalEvents = await _veranstaltungRepository.CountAsync(v => v.VereinId == vereinId, false, cancellationToken);
            var activeEvents = await _veranstaltungRepository.CountAsync(v => v.VereinId == vereinId && v.Aktiv == true, false, cancellationToken);
            var upcomingEvents = await _veranstaltungRepository.CountAsync(v => v.VereinId == vereinId && v.Startdatum > DateTime.Now, false, cancellationToken);
            var pastEvents = await _veranstaltungRepository.CountAsync(v => v.VereinId == vereinId && v.Startdatum <= DateTime.Now, false, cancellationToken);

            return new
            {
                VereinId = vereinId,
                TotalEvents = totalEvents,
                ActiveEvents = activeEvents,
                UpcomingEvents = upcomingEvents,
                PastEvents = pastEvents,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event statistics for verein {VereinId}", vereinId);
            throw;
        }
    }

    #endregion

    #region Pagination

    public async Task<PagedResult<VeranstaltungDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged veranstaltungen, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _veranstaltungRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);

        return new PagedResult<VeranstaltungDto>
        {
            Items = _mapper.Map<IEnumerable<VeranstaltungDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Private Methods

    private async Task ValidateCreateAsync(CreateVeranstaltungDto createDto, CancellationToken cancellationToken)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(createDto.Titel))
        {
            throw new ArgumentException("Titel is required");
        }

        if (createDto.Startdatum <= DateTime.Now)
        {
            throw new ArgumentException("Start date must be in the future");
        }

        if (createDto.Enddatum.HasValue && createDto.Enddatum <= createDto.Startdatum)
        {
            throw new ArgumentException("End date must be after start date");
        }
    }

    private async Task ValidateUpdateAsync(int id, UpdateVeranstaltungDto updateDto, CancellationToken cancellationToken)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(updateDto.Titel))
        {
            throw new ArgumentException("Titel is required");
        }

        if (updateDto.Enddatum.HasValue && updateDto.Enddatum <= updateDto.Startdatum)
        {
            throw new ArgumentException("End date must be after start date");
        }
    }

    #endregion
}
