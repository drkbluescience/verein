using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Mitglied entity with specific operations
/// </summary>
public interface IMitgliedRepository : IRepository<Mitglied>
{
    /// <summary>
    /// Gets mitglied by member number
    /// </summary>
    /// <param name="mitgliedsnummer">Member number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied or null if not found</returns>
    Task<Mitglied?> GetByMitgliedsnummerAsync(string mitgliedsnummer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted mitglieder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by email
    /// </summary>
    /// <param name="email">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder with this email</returns>
    Task<IEnumerable<Mitglied>> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by name (partial match)
    /// </summary>
    /// <param name="vorname">First name (optional)</param>
    /// <param name="nachname">Last name (optional)</param>
    /// <param name="vereinId">Verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching mitglieder</returns>
    Task<IEnumerable<Mitglied>> SearchByNameAsync(string? vorname, string? nachname, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active mitglieder only
    /// </summary>
    /// <param name="vereinId">Verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetActiveMitgliederAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by status
    /// </summary>
    /// <param name="statusId">Member status ID</param>
    /// <param name="vereinId">Verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by type
    /// </summary>
    /// <param name="typId">Member type ID</param>
    /// <param name="vereinId">Verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetByTypAsync(int typId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder who joined within a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetByJoinDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder with birthdays in a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetByBirthdayRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied with addresses
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied with addresses or null if not found</returns>
    Task<Mitglied?> GetWithAddressesAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied with family relationships
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied with family relationships or null if not found</returns>
    Task<Mitglied?> GetWithFamilyAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied with all related data (addresses, family, event registrations)
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied with all related data or null if not found</returns>
    Task<Mitglied?> GetFullAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if member number is unique within a verein
    /// </summary>
    /// <param name="mitgliedsnummer">Member number to check</param>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsMitgliedsnummerUniqueAsync(string mitgliedsnummer, int vereinId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets count of mitglieder by verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Count only active members</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of mitglieder</returns>
    Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);
}
