using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Verein entity with specific operations
/// </summary>
public interface IVereinRepository : IRepository<Verein>
{
    /// <summary>
    /// Gets verein by verein number
    /// </summary>
    /// <param name="vereinNumber">Verein number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verein or null if not found</returns>
    Task<Verein?> GetByVereinNumberAsync(string vereinNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets verein by client code
    /// </summary>
    /// <param name="clientCode">Client code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verein or null if not found</returns>
    Task<Verein?> GetByClientCodeAsync(string clientCode, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets vereine by name (partial match)
    /// </summary>
    /// <param name="name">Name to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching vereine</returns>
    Task<IEnumerable<Verein>> SearchByNameAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active vereine only
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active vereine</returns>
    Task<IEnumerable<Verein>> GetActiveVereineAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets vereine founded within a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of vereine</returns>
    Task<IEnumerable<Verein>> GetByFoundingDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);



    /// <summary>
    /// Checks if verein number is unique
    /// </summary>
    /// <param name="vereinNumber">Verein number to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsVereinNumberUniqueAsync(string vereinNumber, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if client code is unique
    /// </summary>
    /// <param name="clientCode">Client code to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsClientCodeUniqueAsync(string clientCode, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated vereine
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted vereine</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated vereine</returns>
    Task<IEnumerable<Verein>> GetPaginatedAsync(int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total count of vereine
    /// </summary>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted vereine</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total count</returns>
    Task<int> GetTotalCountAsync(string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);
}
