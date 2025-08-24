using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Association entity with specific operations
/// </summary>
public interface IAssociationRepository : IRepository<Association>
{
    /// <summary>
    /// Gets association by association number
    /// </summary>
    /// <param name="associationNumber">Association number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association or null if not found</returns>
    Task<Association?> GetByAssociationNumberAsync(string associationNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets association by client code
    /// </summary>
    /// <param name="clientCode">Client code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association or null if not found</returns>
    Task<Association?> GetByClientCodeAsync(string clientCode, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets associations by name (partial match)
    /// </summary>
    /// <param name="name">Name to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching associations</returns>
    Task<IEnumerable<Association>> SearchByNameAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active associations only
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active associations</returns>
    Task<IEnumerable<Association>> GetActiveAssociationsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets associations founded within a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of associations</returns>
    Task<IEnumerable<Association>> GetByFoundingDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets associations with member count greater than specified value
    /// </summary>
    /// <param name="minMemberCount">Minimum member count</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of associations</returns>
    Task<IEnumerable<Association>> GetByMinimumMemberCountAsync(int minMemberCount, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if association number is unique
    /// </summary>
    /// <param name="associationNumber">Association number to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsAssociationNumberUniqueAsync(string associationNumber, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if client code is unique
    /// </summary>
    /// <param name="clientCode">Client code to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsClientCodeUniqueAsync(string clientCode, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated associations
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated associations</returns>
    Task<IEnumerable<Association>> GetPaginatedAsync(int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total count of associations
    /// </summary>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total count</returns>
    Task<int> GetTotalCountAsync(string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);
}
