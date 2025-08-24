using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Member entity with specific operations
/// </summary>
public interface IMemberRepository : IRepository<Member>
{
    /// <summary>
    /// Gets member by member number
    /// </summary>
    /// <param name="memberNumber">Member number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Member or null if not found</returns>
    Task<Member?> GetByMemberNumberAsync(string memberNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets member by email
    /// </summary>
    /// <param name="email">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Member or null if not found</returns>
    Task<Member?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches members by name
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching members</returns>
    Task<IEnumerable<Member>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets members by membership type
    /// </summary>
    /// <param name="membershipType">Membership type</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of members</returns>
    Task<IEnumerable<Member>> GetByMembershipTypeAsync(string membershipType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets members by status
    /// </summary>
    /// <param name="status">Member status</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of members</returns>
    Task<IEnumerable<Member>> GetByStatusAsync(string status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets members by association
    /// </summary>
    /// <param name="associationId">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of members</returns>
    Task<IEnumerable<Member>> GetByAssociationAsync(int associationId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if member number is unique
    /// </summary>
    /// <param name="memberNumber">Member number to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsMemberNumberUniqueAsync(string memberNumber, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if email is unique
    /// </summary>
    /// <param name="email">Email to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsEmailUniqueAsync(string email, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated members
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted members</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated members</returns>
    Task<IEnumerable<Member>> GetPaginatedAsync(int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total count of members
    /// </summary>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted members</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total count</returns>
    Task<int> GetTotalCountAsync(string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);
}
