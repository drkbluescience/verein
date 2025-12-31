using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.Verein;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Verein business operations
/// </summary>
public class VereinService : IVereinService
{
    private readonly IVereinRepository _vereinRepository;
    private readonly IRepository<Mitglied> _mitgliedRepository;
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly IRepository<Adresse> _adresseRepository;
    private readonly IRepository<Bankkonto> _bankkontoRepository;
    private readonly IRepository<Organization> _organizationRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<VereinService> _logger;

    public VereinService(
        IVereinRepository vereinRepository,
        IRepository<Mitglied> mitgliedRepository,
        IRepository<Veranstaltung> veranstaltungRepository,
        IRepository<Adresse> adresseRepository,
        IRepository<Bankkonto> bankkontoRepository,
        IRepository<Organization> organizationRepository,
        IMapper mapper,
        ILogger<VereinService> logger)
    {
        _vereinRepository = vereinRepository;
        _mitgliedRepository = mitgliedRepository;
        _veranstaltungRepository = veranstaltungRepository;
        _adresseRepository = adresseRepository;
        _bankkontoRepository = bankkontoRepository;
        _organizationRepository = organizationRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<VereinDto> CreateAsync(CreateVereinDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new verein with name {VereinName}", createDto.Name);

        try
        {
            // Validate business rules
            await ValidateCreateAsync(createDto, cancellationToken);

            var verein = _mapper.Map<Verein>(createDto);
            
            var createdVerein = await _vereinRepository.AddAsync(verein, cancellationToken);
            await _vereinRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created verein with ID {VereinId}", createdVerein.Id);
            return _mapper.Map<VereinDto>(createdVerein);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating verein with name {VereinName}", createDto.Name);
            throw;
        }
    }

    public async Task<VereinDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting verein by ID {VereinId}", id);

        var verein = await _vereinRepository.GetByIdAsync(id, false, cancellationToken);
        return verein != null ? _mapper.Map<VereinDto>(verein) : null;
    }

    public async Task<IEnumerable<VereinDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all vereine, includeDeleted: {IncludeDeleted}", includeDeleted);

        var vereine = await _vereinRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDto>>(vereine);
    }

    public async Task<VereinDto> UpdateAsync(int id, UpdateVereinDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating verein {VereinId}", id);

        try
        {
            var existingVerein = await _vereinRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingVerein == null)
            {
                throw new ArgumentException($"Verein with ID {id} not found");
            }

            // Validate business rules
            await ValidateUpdateAsync(id, updateDto, cancellationToken);

            _mapper.Map(updateDto, existingVerein);
            
            var updatedVerein = await _vereinRepository.UpdateAsync(existingVerein, cancellationToken);
            await _vereinRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated verein {VereinId}", id);
            return _mapper.Map<VereinDto>(updatedVerein);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating verein {VereinId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting verein {VereinId}", id);

        try
        {
            var verein = await _vereinRepository.GetByIdAsync(id, false, cancellationToken);
            if (verein == null)
            {
                _logger.LogWarning("Verein {VereinId} not found for deletion", id);
                return false;
            }

            await _vereinRepository.DeleteAsync(verein, cancellationToken);
            await _vereinRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft deleted verein {VereinId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting verein {VereinId}", id);
            throw;
        }
    }

    public async Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("Hard deleting verein {VereinId}", id);

        try
        {
            await _vereinRepository.HardDeleteAsync(id, cancellationToken);
            await _vereinRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully hard deleted verein {VereinId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hard deleting verein {VereinId}", id);
            throw;
        }
    }

    #endregion

    #region Query Operations

    public async Task<VereinDto?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting verein by name {VereinName}", name);

        var verein = await _vereinRepository.GetFirstOrDefaultAsync(v => v.Name == name, false, cancellationToken);
        return verein != null ? _mapper.Map<VereinDto>(verein) : null;
    }

    public async Task<IEnumerable<VereinDto>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Searching vereine by name with term {SearchTerm}", searchTerm);

        var vereine = await _vereinRepository.GetAsync(v => v.Name.Contains(searchTerm), false, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDto>>(vereine);
    }

    public async Task<IEnumerable<VereinDto>> GetByCityAsync(string city, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting vereine by city {City}", city);

        // This would require joining with addresses - simplified for now
        var vereine = await _vereinRepository.GetAllAsync(false, cancellationToken);
        // TODO: Implement proper city filtering with address join
        return _mapper.Map<IEnumerable<VereinDto>>(vereine);
    }

    public async Task<IEnumerable<VereinDto>> GetByPostalCodeAsync(string postalCode, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting vereine by postal code {PostalCode}", postalCode);

        // This would require joining with addresses - simplified for now
        var vereine = await _vereinRepository.GetAllAsync(false, cancellationToken);
        // TODO: Implement proper postal code filtering with address join
        return _mapper.Map<IEnumerable<VereinDto>>(vereine);
    }

    public async Task<IEnumerable<VereinDto>> GetByFoundingDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting vereine by founding date range {FromDate} - {ToDate}", fromDate, toDate);

        var vereine = await _vereinRepository.GetAsync(v => 
            v.Gruendungsdatum.HasValue && 
            v.Gruendungsdatum.Value >= fromDate && 
            v.Gruendungsdatum.Value <= toDate, 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VereinDto>>(vereine);
    }

    public async Task<IEnumerable<VereinDto>> GetActiveVereineAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active vereine");

        var vereine = await _vereinRepository.GetAsync(v => v.Aktiv == true, false, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDto>>(vereine);
    }

    public async Task<VereinDto?> GetFullDetailsAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting verein with full details {VereinId}", id);

        // For now, return basic details - would need to implement includes for full details
        var verein = await _vereinRepository.GetByIdAsync(id, false, cancellationToken);
        return verein != null ? _mapper.Map<VereinDto>(verein) : null;
    }

    #endregion

    #region Business Operations

    public async Task<bool> IsNameUniqueAsync(string name, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking name uniqueness for {VereinName}", name);

        var existingVerein = await _vereinRepository.GetFirstOrDefaultAsync(v => 
            v.Name == name && 
            (excludeId == null || v.Id != excludeId), 
            true, cancellationToken);

        return existingVerein == null;
    }

    public async Task<int> GetMemberCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting member count for verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _mitgliedRepository.CountAsync(m => 
            m.VereinId == vereinId && 
            (!activeOnly || m.Aktiv == true), 
            false, cancellationToken);
    }

    public async Task<int> GetEventCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting event count for verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _veranstaltungRepository.CountAsync(v => 
            v.VereinId == vereinId && 
            (!activeOnly || v.Aktiv == true), 
            false, cancellationToken);
    }

    public async Task<int> GetAddressCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting address count for verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _adresseRepository.CountAsync(a => 
            a.VereinId == vereinId && 
            (!activeOnly || a.Aktiv == true), 
            false, cancellationToken);
    }

    public async Task<int> GetBankAccountCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bank account count for verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _bankkontoRepository.CountAsync(b => 
            b.VereinId == vereinId && 
            (!activeOnly || b.Aktiv == true), 
            false, cancellationToken);
    }

    public async Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Activating verein {VereinId}", id);

        try
        {
            var verein = await _vereinRepository.GetByIdAsync(id, false, cancellationToken);
            if (verein == null)
            {
                return false;
            }

            verein.Aktiv = true;
            await _vereinRepository.UpdateAsync(verein, cancellationToken);
            await _vereinRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully activated verein {VereinId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error activating verein {VereinId}", id);
            throw;
        }
    }

    public async Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deactivating verein {VereinId}", id);

        try
        {
            var verein = await _vereinRepository.GetByIdAsync(id, false, cancellationToken);
            if (verein == null)
            {
                return false;
            }

            verein.Aktiv = false;
            await _vereinRepository.UpdateAsync(verein, cancellationToken);
            await _vereinRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully deactivated verein {VereinId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deactivating verein {VereinId}", id);
            throw;
        }
    }

    #endregion

    #region Statistics

    public async Task<object> GetStatisticsAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting statistics for verein {VereinId}", vereinId);

        try
        {
            var memberCount = await GetMemberCountAsync(vereinId, true, cancellationToken);
            var eventCount = await GetEventCountAsync(vereinId, true, cancellationToken);
            var addressCount = await GetAddressCountAsync(vereinId, true, cancellationToken);
            var bankAccountCount = await GetBankAccountCountAsync(vereinId, true, cancellationToken);

            return new
            {
                VereinId = vereinId,
                MemberCount = memberCount,
                EventCount = eventCount,
                AddressCount = addressCount,
                BankAccountCount = bankAccountCount,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics for verein {VereinId}", vereinId);
            throw;
        }
    }

    public async Task<object> GetSystemStatisticsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting system statistics");

        try
        {
            var totalVereine = await _vereinRepository.CountAsync(null, false, cancellationToken);
            var activeVereine = await _vereinRepository.CountAsync(v => v.Aktiv == true, false, cancellationToken);
            var totalMembers = await _mitgliedRepository.CountAsync(null, false, cancellationToken);
            var activeMembers = await _mitgliedRepository.CountAsync(m => m.Aktiv == true, false, cancellationToken);
            var totalEvents = await _veranstaltungRepository.CountAsync(null, false, cancellationToken);

            return new
            {
                TotalVereine = totalVereine,
                ActiveVereine = activeVereine,
                TotalMembers = totalMembers,
                ActiveMembers = activeMembers,
                TotalEvents = totalEvents,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system statistics");
            throw;
        }
    }

    #endregion

    #region Pagination

    public async Task<PagedResult<VereinDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged vereine, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _vereinRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<VereinDto>
        {
            Items = _mapper.Map<IEnumerable<VereinDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Private Methods

    private async Task ValidateCreateAsync(CreateVereinDto createDto, CancellationToken cancellationToken)
    {
        // Check name uniqueness
        if (!await IsNameUniqueAsync(createDto.Name, null, cancellationToken))
        {
            throw new ArgumentException($"Verein name '{createDto.Name}' already exists");
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(createDto.Name))
        {
            throw new ArgumentException("Verein name is required");
        }

        if (createDto.OrganizationId <= 0)
        {
            throw new ArgumentException("OrganizationId is required");
        }

        var organization = await _organizationRepository.GetByIdAsync(createDto.OrganizationId, true, cancellationToken);
        if (organization == null)
        {
            throw new ArgumentException($"Organization with ID {createDto.OrganizationId} not found");
        }

        if (organization.DeletedFlag == true)
        {
            throw new ArgumentException("Selected organization is deleted");
        }

        if (!string.Equals(organization.OrgType, "Verein", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Organization type must be 'Verein'");
        }
    }

    private async Task ValidateUpdateAsync(int id, UpdateVereinDto updateDto, CancellationToken cancellationToken)
    {
        // Check name uniqueness (excluding current record)
        if (!await IsNameUniqueAsync(updateDto.Name, id, cancellationToken))
        {
            throw new ArgumentException($"Verein name '{updateDto.Name}' already exists");
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(updateDto.Name))
        {
            throw new ArgumentException("Verein name is required");
        }

        if (updateDto.OrganizationId.HasValue)
        {
            var organization = await _organizationRepository.GetByIdAsync(updateDto.OrganizationId.Value, true, cancellationToken);
            if (organization == null)
            {
                throw new ArgumentException($"Organization with ID {updateDto.OrganizationId.Value} not found");
            }

            if (organization.DeletedFlag == true)
            {
                throw new ArgumentException("Selected organization is deleted");
            }

            if (!string.Equals(organization.OrgType, "Verein", StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException("Organization type must be 'Verein'");
            }
        }
    }

    #endregion
}
