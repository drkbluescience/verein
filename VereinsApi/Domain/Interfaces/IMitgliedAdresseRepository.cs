using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for MitgliedAdresse entity with specific operations
/// </summary>
public interface IMitgliedAdresseRepository : IRepository<MitgliedAdresse>
{
    /// <summary>
    /// Gets addresses by mitglied ID
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresse>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by address type
    /// </summary>
    /// <param name="adresseTypId">Address type ID</param>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresse>> GetByAddressTypeAsync(int adresseTypId, int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets standard address for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Standard address or null if not found</returns>
    Task<MitgliedAdresse?> GetStandardAddressAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by postal code
    /// </summary>
    /// <param name="plz">Postal code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresse>> GetByPostalCodeAsync(string plz, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses by city
    /// </summary>
    /// <param name="ort">City name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses</returns>
    Task<IEnumerable<MitgliedAdresse>> GetByCityAsync(string ort, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses within a geographic area (bounding box)
    /// </summary>
    /// <param name="minLatitude">Minimum latitude</param>
    /// <param name="maxLatitude">Maximum latitude</param>
    /// <param name="minLongitude">Minimum longitude</param>
    /// <param name="maxLongitude">Maximum longitude</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of addresses within the area</returns>
    Task<IEnumerable<MitgliedAdresse>> GetByGeographicAreaAsync(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets addresses valid at a specific date
    /// </summary>
    /// <param name="date">Date to check validity</param>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of valid addresses</returns>
    Task<IEnumerable<MitgliedAdresse>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active addresses only
    /// </summary>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active addresses</returns>
    Task<IEnumerable<MitgliedAdresse>> GetActiveAddressesAsync(int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets an address as standard for a mitglied (unsets others)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="addressId">Address ID to set as standard</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task SetAsStandardAddressAsync(int mitgliedId, int addressId, CancellationToken cancellationToken = default);

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
}
