using VereinsApi.DTOs.Adresse;
using VereinsApi.Common.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Adresse business operations
/// </summary>
public interface IAdresseService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new adresse
    /// </summary>
    /// <param name="createDto">Adresse creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created adresse</returns>
    Task<AdresseDto> CreateAsync(CreateAdresseDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets adresse by ID
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Adresse or null if not found</returns>
    Task<AdresseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all adressen
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted adressen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen</returns>
    Task<IEnumerable<AdresseDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing adresse
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated adresse</returns>
    Task<AdresseDto> UpdateAsync(int id, UpdateAdresseDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes an adresse
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes an adresse (permanent deletion)
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets adressen by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted adressen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen for the verein</returns>
    Task<IEnumerable<AdresseDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets adressen by postal code
    /// </summary>
    /// <param name="plz">Postal code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen with the specified postal code</returns>
    Task<IEnumerable<AdresseDto>> GetByPostalCodeAsync(string plz, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets adressen by city
    /// </summary>
    /// <param name="ort">City name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen in the specified city</returns>
    Task<IEnumerable<AdresseDto>> GetByCityAsync(string ort, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets adressen by country
    /// </summary>
    /// <param name="land">Country name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen in the specified country</returns>
    Task<IEnumerable<AdresseDto>> GetByCountryAsync(string land, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets adressen within a geographic area
    /// </summary>
    /// <param name="minLatitude">Minimum latitude</param>
    /// <param name="maxLatitude">Maximum latitude</param>
    /// <param name="minLongitude">Minimum longitude</param>
    /// <param name="maxLongitude">Maximum longitude</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen within the specified area</returns>
    Task<IEnumerable<AdresseDto>> GetByGeographicAreaAsync(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets adressen valid at a specific date
    /// </summary>
    /// <param name="date">Date to check validity</param>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of adressen valid at the specified date</returns>
    Task<IEnumerable<AdresseDto>> GetValidAtDateAsync(DateTime date, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active adressen
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active adressen</returns>
    Task<IEnumerable<AdresseDto>> GetActiveAddressesAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets standard address for a Verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Standard address or null if not found</returns>
    Task<AdresseDto?> GetStandardAddressAsync(int vereinId, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Sets an address as standard for a Verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="addressId">Address ID to set as standard</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> SetAsStandardAddressAsync(int vereinId, int addressId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a Verein has any addresses
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the Verein has addresses</returns>
    Task<bool> HasAddressesAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets address count for a Verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Whether to count only active addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of addresses</returns>
    Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paged adressen
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted adressen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paged result of adressen</returns>
    Task<PagedResult<AdresseDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}
