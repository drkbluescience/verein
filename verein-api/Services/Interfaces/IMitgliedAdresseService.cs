using VereinsApi.DTOs.MitgliedAdresse;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for MitgliedAdresse business operations
/// </summary>
public interface IMitgliedAdresseService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new mitglied address
    /// </summary>
    /// <param name="createDto">Address creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created address</returns>
    Task<MitgliedAdresseDto> CreateAsync(CreateMitgliedAdresseDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets address by ID
    /// </summary>
    /// <param name="id">Address ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Address or null if not found</returns>
    Task<MitgliedAdresseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all addresses
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing address
    /// </summary>
    /// <param name="id">Address ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated address</returns>
    Task<MitgliedAdresseDto> UpdateAsync(int id, UpdateMitgliedAdresseDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes an address
    /// </summary>
    /// <param name="id">Address ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated addresses
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result</returns>
    Task<PagedResult<MitgliedAdresseDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Sets an address as standard for a mitglied (unsets others)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="addressId">Address ID to set as standard</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated address</returns>
    Task<MitgliedAdresseDto> SetAsStandardAddressAsync(int mitgliedId, int addressId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets standard address for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Standard address or null if not found</returns>
    Task<MitgliedAdresseDto?> GetStandardAddressAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates address with GPS coordinate validation and geocoding
    /// </summary>
    /// <param name="createDto">Address creation data</param>
    /// <param name="validateCoordinates">Whether to validate GPS coordinates</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created address with validated coordinates</returns>
    Task<MitgliedAdresseDto> CreateWithValidationAsync(CreateMitgliedAdresseDto createDto, bool validateCoordinates = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates address validity period
    /// </summary>
    /// <param name="addressId">Address ID</param>
    /// <param name="gueltigVon">Valid from date</param>
    /// <param name="gueltigBis">Valid until date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated address</returns>
    Task<MitgliedAdresseDto> UpdateValidityPeriodAsync(int addressId, DateTime? gueltigVon, DateTime? gueltigBis, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates or deactivates an address
    /// </summary>
    /// <param name="id">Address ID</param>
    /// <param name="isActive">Active status</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated address</returns>
    Task<MitgliedAdresseDto> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default);

    #endregion

    #region Search and Filter Operations

    /// <summary>
    /// Gets addresses by mitglied ID
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by address type
    /// </summary>
    /// <param name="adresseTypId">Address type ID</param>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetByAddressTypeAsync(int adresseTypId, int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by postal code
    /// </summary>
    /// <param name="plz">Postal code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetByPostalCodeAsync(string plz, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by city
    /// </summary>
    /// <param name="ort">City name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetByCityAsync(string ort, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses within a geographic area (bounding box)
    /// </summary>
    /// <param name="minLatitude">Minimum latitude</param>
    /// <param name="maxLatitude">Maximum latitude</param>
    /// <param name="minLongitude">Minimum longitude</param>
    /// <param name="maxLongitude">Maximum longitude</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses within the area</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetByGeographicAreaAsync(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses valid at a specific date
    /// </summary>
    /// <param name="date">Date to check validity</param>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of valid addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active addresses only
    /// </summary>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active addresses</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetActiveAddressesAsync(int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets address history for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses ordered by validity period</returns>
    Task<IEnumerable<MitgliedAdresseDto>> GetAddressHistoryAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion

    #region Validation Operations

    /// <summary>
    /// Validates address data for business rules
    /// </summary>
    /// <param name="createDto">Address creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<ValidationResult> ValidateCreateAsync(CreateMitgliedAdresseDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates address update data for business rules
    /// </summary>
    /// <param name="id">Address ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<ValidationResult> ValidateUpdateAsync(int id, UpdateMitgliedAdresseDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates GPS coordinates
    /// </summary>
    /// <param name="latitude">Latitude</param>
    /// <param name="longitude">Longitude</param>
    /// <returns>True if coordinates are valid</returns>
    bool ValidateGpsCoordinates(double? latitude, double? longitude);

    /// <summary>
    /// Validates address validity period
    /// </summary>
    /// <param name="gueltigVon">Valid from date</param>
    /// <param name="gueltigBis">Valid until date</param>
    /// <returns>True if validity period is valid</returns>
    bool ValidateValidityPeriod(DateTime? gueltigVon, DateTime? gueltigBis);

    #endregion

    #region Statistics Operations

    /// <summary>
    /// Checks if a mitglied has any addresses
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if has addresses, false otherwise</returns>
    Task<bool> HasAddressesAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets count of addresses by mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="activeOnly">Count only active addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of addresses</returns>
    Task<int> GetCountByMitgliedAsync(int mitgliedId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets address statistics for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Address statistics</returns>
    Task<AddressStatistics> GetAddressStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default);

    #endregion
}


