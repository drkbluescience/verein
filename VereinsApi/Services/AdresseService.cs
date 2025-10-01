using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.Adresse;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Adresse business operations
/// </summary>
public class AdresseService : IAdresseService
{
    private readonly IRepository<Adresse> _adresseRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<AdresseService> _logger;

    public AdresseService(
        IRepository<Adresse> adresseRepository,
        IMapper mapper,
        ILogger<AdresseService> logger)
    {
        _adresseRepository = adresseRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<AdresseDto> CreateAsync(CreateAdresseDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new adresse for Verein {VereinId}", createDto.VereinId);

        try
        {
            // Validate business rules
            await ValidateCreateAsync(createDto, cancellationToken);

            var adresse = _mapper.Map<Adresse>(createDto);
            
            var createdAdresse = await _adresseRepository.AddAsync(adresse, cancellationToken);
            await _adresseRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created adresse with ID {AdresseId}", createdAdresse.Id);
            return _mapper.Map<AdresseDto>(createdAdresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating adresse for Verein {VereinId}", createDto.VereinId);
            throw;
        }
    }

    public async Task<AdresseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adresse by ID {AdresseId}", id);

        var adresse = await _adresseRepository.GetByIdAsync(id, false, cancellationToken);
        return adresse != null ? _mapper.Map<AdresseDto>(adresse) : null;
    }

    public async Task<IEnumerable<AdresseDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all adressen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var adressen = await _adresseRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<AdresseDto> UpdateAsync(int id, UpdateAdresseDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating adresse {AdresseId}", id);

        try
        {
            var existingAdresse = await _adresseRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingAdresse == null)
            {
                throw new ArgumentException($"Adresse with ID {id} not found");
            }

            // Validate business rules
            await ValidateUpdateAsync(id, updateDto, cancellationToken);

            _mapper.Map(updateDto, existingAdresse);
            
            var updatedAdresse = await _adresseRepository.UpdateAsync(existingAdresse, cancellationToken);
            await _adresseRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated adresse {AdresseId}", id);
            return _mapper.Map<AdresseDto>(updatedAdresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating adresse {AdresseId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting adresse {AdresseId}", id);

        try
        {
            var adresse = await _adresseRepository.GetByIdAsync(id, false, cancellationToken);
            if (adresse == null)
            {
                _logger.LogWarning("Adresse {AdresseId} not found for deletion", id);
                return false;
            }

            await _adresseRepository.DeleteAsync(adresse, cancellationToken);
            await _adresseRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft deleted adresse {AdresseId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting adresse {AdresseId}", id);
            throw;
        }
    }

    public async Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("Hard deleting adresse {AdresseId}", id);

        try
        {
            await _adresseRepository.HardDeleteAsync(id, cancellationToken);
            await _adresseRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully hard deleted adresse {AdresseId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hard deleting adresse {AdresseId}", id);
            throw;
        }
    }

    #endregion

    #region Query Operations

    public async Task<IEnumerable<AdresseDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adressen for Verein {VereinId}", vereinId);

        var adressen = await _adresseRepository.GetAsync(a => a.VereinId == vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<IEnumerable<AdresseDto>> GetByPostalCodeAsync(string plz, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adressen by postal code {PLZ}", plz);

        var adressen = await _adresseRepository.GetAsync(a => a.PLZ == plz, false, cancellationToken);
        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<IEnumerable<AdresseDto>> GetByCityAsync(string ort, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adressen by city {Ort}", ort);

        var adressen = await _adresseRepository.GetAsync(a => a.Ort == ort, false, cancellationToken);
        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<IEnumerable<AdresseDto>> GetByCountryAsync(string land, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adressen by country {Land}", land);

        var adressen = await _adresseRepository.GetAsync(a => a.Land == land, false, cancellationToken);
        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<IEnumerable<AdresseDto>> GetByGeographicAreaAsync(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adressen by geographic area");

        var adressen = await _adresseRepository.GetAsync(a => 
            a.Latitude.HasValue && a.Longitude.HasValue &&
            a.Latitude.Value >= minLatitude && a.Latitude.Value <= maxLatitude &&
            a.Longitude.Value >= minLongitude && a.Longitude.Value <= maxLongitude, 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<IEnumerable<AdresseDto>> GetValidAtDateAsync(DateTime date, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting adressen valid at date {Date}", date);

        var adressen = await _adresseRepository.GetAsync(a => 
            (a.GueltigVon == null || a.GueltigVon <= date) &&
            (a.GueltigBis == null || a.GueltigBis >= date) &&
            (vereinId == null || a.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<IEnumerable<AdresseDto>> GetActiveAddressesAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active adressen");

        var adressen = await _adresseRepository.GetAsync(a => 
            a.Aktiv == true &&
            (vereinId == null || a.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<AdresseDto>>(adressen);
    }

    public async Task<AdresseDto?> GetStandardAddressAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting standard address for Verein {VereinId}", vereinId);

        var adresse = await _adresseRepository.GetFirstOrDefaultAsync(a => 
            a.VereinId == vereinId && a.IstStandard == true, 
            false, cancellationToken);

        return adresse != null ? _mapper.Map<AdresseDto>(adresse) : null;
    }

    #endregion

    #region Business Operations

    public async Task<bool> SetAsStandardAddressAsync(int vereinId, int addressId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting address {AddressId} as standard for Verein {VereinId}", addressId, vereinId);

        try
        {
            // First, unset all standard addresses for this verein
            var existingStandardAddresses = await _adresseRepository.GetAsync(a => 
                a.VereinId == vereinId && a.IstStandard == true, 
                false, cancellationToken);

            foreach (var address in existingStandardAddresses)
            {
                address.IstStandard = false;
                await _adresseRepository.UpdateAsync(address, cancellationToken);
            }

            // Then set the specified address as standard
            var targetAddress = await _adresseRepository.GetByIdAsync(addressId, false, cancellationToken);
            if (targetAddress == null || targetAddress.VereinId != vereinId)
            {
                throw new ArgumentException($"Address {addressId} not found or does not belong to Verein {vereinId}");
            }

            targetAddress.IstStandard = true;
            await _adresseRepository.UpdateAsync(targetAddress, cancellationToken);
            await _adresseRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully set address {AddressId} as standard for Verein {VereinId}", addressId, vereinId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting address {AddressId} as standard for Verein {VereinId}", addressId, vereinId);
            throw;
        }
    }

    public async Task<bool> HasAddressesAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if Verein {VereinId} has addresses", vereinId);

        return await _adresseRepository.ExistsAsync(a => a.VereinId == vereinId, false, cancellationToken);
    }

    public async Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting address count for Verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _adresseRepository.CountAsync(a => 
            a.VereinId == vereinId && 
            (!activeOnly || a.Aktiv == true), 
            false, cancellationToken);
    }

    #endregion

    #region Pagination

    public async Task<PagedResult<AdresseDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged adressen, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _adresseRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<AdresseDto>
        {
            Items = _mapper.Map<IEnumerable<AdresseDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Private Methods

    private async Task ValidateCreateAsync(CreateAdresseDto createDto, CancellationToken cancellationToken)
    {
        // Add business validation logic here
        if (string.IsNullOrWhiteSpace(createDto.Strasse))
        {
            throw new ArgumentException("Strasse is required");
        }

        if (string.IsNullOrWhiteSpace(createDto.PLZ))
        {
            throw new ArgumentException("PLZ is required");
        }

        if (string.IsNullOrWhiteSpace(createDto.Ort))
        {
            throw new ArgumentException("Ort is required");
        }
    }

    private async Task ValidateUpdateAsync(int id, UpdateAdresseDto updateDto, CancellationToken cancellationToken)
    {
        // Add business validation logic here
        if (string.IsNullOrWhiteSpace(updateDto.Strasse))
        {
            throw new ArgumentException("Strasse is required");
        }

        if (string.IsNullOrWhiteSpace(updateDto.PLZ))
        {
            throw new ArgumentException("PLZ is required");
        }

        if (string.IsNullOrWhiteSpace(updateDto.Ort))
        {
            throw new ArgumentException("Ort is required");
        }
    }

    #endregion
}
