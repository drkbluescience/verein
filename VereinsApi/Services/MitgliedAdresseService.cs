using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.MitgliedAdresse;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for MitgliedAdresse business operations
/// </summary>
public class MitgliedAdresseService : IMitgliedAdresseService
{
    private readonly IMitgliedAdresseRepository _mitgliedAdresseRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedAdresseService> _logger;

    public MitgliedAdresseService(
        IMitgliedAdresseRepository mitgliedAdresseRepository,
        IMapper mapper,
        ILogger<MitgliedAdresseService> logger)
    {
        _mitgliedAdresseRepository = mitgliedAdresseRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<MitgliedAdresseDto> CreateAsync(CreateMitgliedAdresseDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new mitglied address for mitglied {MitgliedId}", createDto.MitgliedId);

        // Validate business rules
        var validationResult = await ValidateCreateAsync(createDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
        }

        try
        {
            var adresse = _mapper.Map<MitgliedAdresse>(createDto);
            adresse.Created = DateTime.UtcNow;
            adresse.CreatedBy = 1; // TODO: Get from current user context

            var createdAdresse = await _mitgliedAdresseRepository.AddAsync(adresse, cancellationToken);
            
            _logger.LogInformation("Successfully created mitglied address with ID {AdresseId}", createdAdresse.Id);
            
            return _mapper.Map<MitgliedAdresseDto>(createdAdresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating mitglied address for mitglied {MitgliedId}", createDto.MitgliedId);
            throw;
        }
    }

    public async Task<MitgliedAdresseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting mitglied address by ID {AdresseId}", id);

        var adresse = await _mitgliedAdresseRepository.GetByIdAsync(id, false, cancellationToken);
        return adresse != null ? _mapper.Map<MitgliedAdresseDto>(adresse) : null;
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all mitglied addresses, includeDeleted: {IncludeDeleted}", includeDeleted);

        var adressen = await _mitgliedAdresseRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<MitgliedAdresseDto> UpdateAsync(int id, UpdateMitgliedAdresseDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating mitglied address with ID {AdresseId}", id);

        // Validate business rules
        var validationResult = await ValidateUpdateAsync(id, updateDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ArgumentException($"Validation failed: {string.Join(", ", validationResult.Errors)}");
        }

        try
        {
            var existingAdresse = await _mitgliedAdresseRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingAdresse == null)
            {
                throw new ArgumentException($"Mitglied address with ID {id} not found");
            }

            _mapper.Map(updateDto, existingAdresse);
            existingAdresse.Modified = DateTime.UtcNow;
            existingAdresse.ModifiedBy = 1; // TODO: Get from current user context

            var updatedAdresse = await _mitgliedAdresseRepository.UpdateAsync(existingAdresse, cancellationToken);
            
            _logger.LogInformation("Successfully updated mitglied address with ID {AdresseId}", id);
            
            return _mapper.Map<MitgliedAdresseDto>(updatedAdresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating mitglied address with ID {AdresseId}", id);
            throw;
        }
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting mitglied address with ID {AdresseId}", id);

        try
        {
            await _mitgliedAdresseRepository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted mitglied address with ID {AdresseId}", id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting mitglied address with ID {AdresseId}", id);
            throw;
        }
    }

    public async Task<PagedResult<MitgliedAdresseDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged mitglied addresses, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _mitgliedAdresseRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<MitgliedAdresseDto>
        {
            Items = _mapper.Map<IEnumerable<MitgliedAdresseDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Business Operations

    public async Task<MitgliedAdresseDto> SetAsStandardAddressAsync(int mitgliedId, int addressId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting address {AdresseId} as standard for mitglied {MitgliedId}", addressId, mitgliedId);

        try
        {
            await _mitgliedAdresseRepository.SetAsStandardAddressAsync(mitgliedId, addressId, cancellationToken);
            
            var updatedAddress = await _mitgliedAdresseRepository.GetByIdAsync(addressId, false, cancellationToken);
            if (updatedAddress == null)
            {
                throw new ArgumentException($"Address with ID {addressId} not found");
            }

            _logger.LogInformation("Successfully set address {AdresseId} as standard for mitglied {MitgliedId}", addressId, mitgliedId);
            
            return _mapper.Map<MitgliedAdresseDto>(updatedAddress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting address {AdresseId} as standard for mitglied {MitgliedId}", addressId, mitgliedId);
            throw;
        }
    }

    public async Task<MitgliedAdresseDto?> GetStandardAddressAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting standard address for mitglied {MitgliedId}", mitgliedId);

        var standardAddress = await _mitgliedAdresseRepository.GetStandardAddressAsync(mitgliedId, cancellationToken);
        return standardAddress != null ? _mapper.Map<MitgliedAdresseDto>(standardAddress) : null;
    }

    public async Task<MitgliedAdresseDto> CreateWithValidationAsync(CreateMitgliedAdresseDto createDto, bool validateCoordinates = true, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating mitglied address with validation for mitglied {MitgliedId}", createDto.MitgliedId);

        // Additional GPS validation if requested
        if (validateCoordinates && createDto.Latitude.HasValue && createDto.Longitude.HasValue)
        {
            if (!ValidateGpsCoordinates(createDto.Latitude.Value, createDto.Longitude.Value))
            {
                throw new ArgumentException("GPS coordinates are invalid");
            }
        }

        return await CreateAsync(createDto, cancellationToken);
    }

    public async Task<MitgliedAdresseDto> UpdateValidityPeriodAsync(int addressId, DateTime? gueltigVon, DateTime? gueltigBis, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating validity period for address {AdresseId}", addressId);

        if (!ValidateValidityPeriod(gueltigVon, gueltigBis))
        {
            throw new ArgumentException("Invalid validity period: start date must be before end date");
        }

        try
        {
            var address = await _mitgliedAdresseRepository.GetByIdAsync(addressId, false, cancellationToken);
            if (address == null)
            {
                throw new ArgumentException($"Address with ID {addressId} not found");
            }

            address.GueltigVon = gueltigVon;
            address.GueltigBis = gueltigBis;
            address.Modified = DateTime.UtcNow;
            address.ModifiedBy = 1; // TODO: Get from current user context

            var updatedAddress = await _mitgliedAdresseRepository.UpdateAsync(address, cancellationToken);
            
            _logger.LogInformation("Successfully updated validity period for address {AdresseId}", addressId);
            
            return _mapper.Map<MitgliedAdresseDto>(updatedAddress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating validity period for address {AdresseId}", addressId);
            throw;
        }
    }

    public async Task<MitgliedAdresseDto> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting active status for address {AdresseId} to {IsActive}", id, isActive);

        try
        {
            var address = await _mitgliedAdresseRepository.GetByIdAsync(id, false, cancellationToken);
            if (address == null)
            {
                throw new ArgumentException($"Address with ID {id} not found");
            }

            address.Aktiv = isActive;
            address.Modified = DateTime.UtcNow;
            address.ModifiedBy = 1; // TODO: Get from current user context

            var updatedAddress = await _mitgliedAdresseRepository.UpdateAsync(address, cancellationToken);

            _logger.LogInformation("Successfully set active status for address {AdresseId} to {IsActive}", id, isActive);

            return _mapper.Map<MitgliedAdresseDto>(updatedAddress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting active status for address {AdresseId}", id);
            throw;
        }
    }

    #endregion

    #region Search and Filter Operations

    public async Task<IEnumerable<MitgliedAdresseDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting addresses by mitglied ID {MitgliedId}", mitgliedId);

        var adressen = await _mitgliedAdresseRepository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetByAddressTypeAsync(int adresseTypId, int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting addresses by type {AdresseTypId}", adresseTypId);

        var adressen = await _mitgliedAdresseRepository.GetByAddressTypeAsync(adresseTypId, mitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetByPostalCodeAsync(string plz, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting addresses by postal code {PLZ}", plz);

        var adressen = await _mitgliedAdresseRepository.GetByPostalCodeAsync(plz, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetByCityAsync(string ort, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting addresses by city {Ort}", ort);

        var adressen = await _mitgliedAdresseRepository.GetByCityAsync(ort, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetByGeographicAreaAsync(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting addresses by geographic area");

        var adressen = await _mitgliedAdresseRepository.GetByGeographicAreaAsync(minLatitude, maxLatitude, minLongitude, maxLongitude, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting addresses valid at date {Date}", date);

        var adressen = await _mitgliedAdresseRepository.GetValidAtDateAsync(date, mitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetActiveAddressesAsync(int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active addresses for mitglied {MitgliedId}", mitgliedId);

        var adressen = await _mitgliedAdresseRepository.GetActiveAddressesAsync(mitgliedId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(adressen);
    }

    public async Task<IEnumerable<MitgliedAdresseDto>> GetAddressHistoryAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting address history for mitglied {MitgliedId}", mitgliedId);

        var adressen = await _mitgliedAdresseRepository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        
        // Order by validity period for history view
        var orderedAdressen = adressen.OrderByDescending(a => a.GueltigVon ?? DateTime.MinValue)
                                     .ThenByDescending(a => a.Created);
        
        return _mapper.Map<IEnumerable<MitgliedAdresseDto>>(orderedAdressen);
    }

    #endregion

    #region Validation Operations

    public Task<ValidationResult> ValidateCreateAsync(CreateMitgliedAdresseDto createDto, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        // Check required fields
        if (createDto.MitgliedId <= 0)
        {
            result.Errors.Add("MitgliedId ist erforderlich");
        }

        if (createDto.AdresseTypId <= 0)
        {
            result.Errors.Add("AdresseTypId ist erforderlich");
        }

        if (string.IsNullOrWhiteSpace(createDto.Strasse))
        {
            result.Errors.Add("Straße ist erforderlich");
        }

        if (string.IsNullOrWhiteSpace(createDto.PLZ))
        {
            result.Errors.Add("PLZ ist erforderlich");
        }

        if (string.IsNullOrWhiteSpace(createDto.Ort))
        {
            result.Errors.Add("Ort ist erforderlich");
        }

        // Validate GPS coordinates
        if (createDto.Latitude.HasValue && createDto.Longitude.HasValue)
        {
            if (!ValidateGpsCoordinates(createDto.Latitude.Value, createDto.Longitude.Value))
            {
                result.Errors.Add("GPS-Koordinaten sind ungültig");
            }
        }

        // Validate validity period
        if (!ValidateValidityPeriod(createDto.GueltigVon, createDto.GueltigBis))
        {
            result.Errors.Add("Gültigkeitszeitraum ist ungültig: Startdatum muss vor Enddatum liegen");
        }

        result.IsValid = result.Errors.Count == 0;
        return Task.FromResult(result);
    }

    public async Task<ValidationResult> ValidateUpdateAsync(int id, UpdateMitgliedAdresseDto updateDto, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        // Check if address exists
        var existingAddress = await _mitgliedAdresseRepository.GetByIdAsync(id, false, cancellationToken);
        if (existingAddress == null)
        {
            result.Errors.Add($"Adresse mit ID {id} nicht gefunden");
            result.IsValid = false;
            return result;
        }

        // Validate GPS coordinates if provided
        if (updateDto.Latitude.HasValue && updateDto.Longitude.HasValue)
        {
            if (!ValidateGpsCoordinates(updateDto.Latitude.Value, updateDto.Longitude.Value))
            {
                result.Errors.Add("GPS-Koordinaten sind ungültig");
            }
        }

        // Validate validity period
        var gueltigVon = updateDto.GueltigVon ?? existingAddress.GueltigVon;
        var gueltigBis = updateDto.GueltigBis ?? existingAddress.GueltigBis;

        if (!ValidateValidityPeriod(gueltigVon, gueltigBis))
        {
            result.Errors.Add("Gültigkeitszeitraum ist ungültig: Startdatum muss vor Enddatum liegen");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    public bool ValidateGpsCoordinates(double? latitude, double? longitude)
    {
        if (!latitude.HasValue || !longitude.HasValue)
        {
            return true; // Null values are valid (optional)
        }

        return latitude.Value >= -90 && latitude.Value <= 90 &&
               longitude.Value >= -180 && longitude.Value <= 180;
    }

    public bool ValidateValidityPeriod(DateTime? gueltigVon, DateTime? gueltigBis)
    {
        if (!gueltigVon.HasValue || !gueltigBis.HasValue)
        {
            return true; // Null values are valid (open-ended periods)
        }

        return gueltigVon.Value <= gueltigBis.Value;
    }

    #endregion

    #region Statistics Operations

    public async Task<bool> HasAddressesAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if mitglied {MitgliedId} has addresses", mitgliedId);

        return await _mitgliedAdresseRepository.HasAddressesAsync(mitgliedId, cancellationToken);
    }

    public async Task<int> GetCountByMitgliedAsync(int mitgliedId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting count of addresses for mitglied {MitgliedId}, activeOnly: {ActiveOnly}", mitgliedId, activeOnly);

        return await _mitgliedAdresseRepository.GetCountByMitgliedAsync(mitgliedId, activeOnly, cancellationToken);
    }

    public async Task<AddressStatistics> GetAddressStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting address statistics for mitglied {MitgliedId}", mitgliedId);

        try
        {
            var allAddresses = await _mitgliedAdresseRepository.GetByMitgliedIdAsync(mitgliedId, true, cancellationToken);
            var activeAddresses = allAddresses.Where(a => a.Aktiv == true);
            var inactiveAddresses = allAddresses.Where(a => a.Aktiv != true);

            var hasStandardAddress = allAddresses.Any(a => a.IstStandard == true && a.Aktiv == true);

            var addressesByType = allAddresses
                .GroupBy(a => a.AdresseTypId)
                .ToDictionary(g => g.Key, g => g.Count());

            var addressesWithGps = allAddresses.Count(a => a.Latitude.HasValue && a.Longitude.HasValue);

            return new AddressStatistics
            {
                TotalAddresses = allAddresses.Count(),
                ActiveAddresses = activeAddresses.Count(),
                InactiveAddresses = inactiveAddresses.Count(),
                HasStandardAddress = hasStandardAddress,
                AddressesByType = addressesByType,
                AddressesWithGpsCoordinates = addressesWithGps
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting address statistics for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    #endregion
}
