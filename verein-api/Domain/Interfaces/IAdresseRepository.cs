using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Adresse entity operations
/// </summary>
public interface IAdresseRepository : IRepository<Adresse>
{
    /// <summary>
    /// Gets addresses by verein ID
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<Adresse>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by address type ID
    /// </summary>
    /// <param name="addressTypeId">Address type identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<Adresse>> GetByAddressTypeIdAsync(int addressTypeId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by postal code
    /// </summary>
    /// <param name="postalCode">Postal code</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<Adresse>> GetByPostalCodeAsync(string postalCode, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by city
    /// </summary>
    /// <param name="city">City name</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<Adresse>> GetByCityAsync(string city, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets default addresses for vereine
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of default addresses</returns>
    Task<IEnumerable<Adresse>> GetDefaultAddressesAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses within a geographic area
    /// </summary>
    /// <param name="centerLatitude">Center latitude</param>
    /// <param name="centerLongitude">Center longitude</param>
    /// <param name="radiusKm">Radius in kilometers</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses within the specified area</returns>
    Task<IEnumerable<Adresse>> GetAddressesInAreaAsync(double centerLatitude, double centerLongitude, double radiusKm, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches addresses by various criteria
    /// </summary>
    /// <param name="searchTerm">Search term to match against street, city, district, etc.</param>
    /// <param name="vereinId">Optional verein ID filter</param>
    /// <param name="addressTypeId">Optional address type ID filter</param>
    /// <param name="country">Optional country filter</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching addresses</returns>
    Task<IEnumerable<Adresse>> SearchAddressesAsync(string searchTerm, int? vereinId = null, int? addressTypeId = null, string? country = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses that are valid for a specific date
    /// </summary>
    /// <param name="validDate">Date to check validity against</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses valid for the specified date</returns>
    Task<IEnumerable<Adresse>> GetValidAddressesForDateAsync(DateTime validDate, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if an address exists for the given verein and type
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="addressTypeId">Address type identifier</param>
    /// <param name="excludeId">Address ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if address exists, false otherwise</returns>
    Task<bool> ExistsForVereinAndTypeAsync(int vereinId, int addressTypeId, int? excludeId = null, CancellationToken cancellationToken = default);
}
