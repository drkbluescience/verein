using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for MitgliedFamilie entity with specific operations
/// </summary>
public interface IMitgliedFamilieRepository : IRepository<MitgliedFamilie>
{
    /// <summary>
    /// Gets family relationships by mitglied ID (as child)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships where mitglied is the child</returns>
    Task<IEnumerable<MitgliedFamilie>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by parent mitglied ID
    /// </summary>
    /// <param name="parentMitgliedId">Parent mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships where mitglied is the parent</returns>
    Task<IEnumerable<MitgliedFamilie>> GetByParentMitgliedIdAsync(int parentMitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all family relationships for a mitglied (both as child and parent)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of all family relationships</returns>
    Task<IEnumerable<MitgliedFamilie>> GetAllRelationshipsAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilie>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by relationship type
    /// </summary>
    /// <param name="familienbeziehungTypId">Family relationship type ID</param>
    /// <param name="vereinId">Optional verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilie>> GetByRelationshipTypeAsync(int familienbeziehungTypId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by status
    /// </summary>
    /// <param name="statusId">Family relationship status ID</param>
    /// <param name="vereinId">Optional verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilie>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships valid at a specific date
    /// </summary>
    /// <param name="date">Date to check validity</param>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of valid family relationships</returns>
    Task<IEnumerable<MitgliedFamilie>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active family relationships only
    /// </summary>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active family relationships</returns>
    Task<IEnumerable<MitgliedFamilie>> GetActiveRelationshipsAsync(int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets children of a parent mitglied
    /// </summary>
    /// <param name="parentMitgliedId">Parent mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of child mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetChildrenAsync(int parentMitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets parents of a child mitglied
    /// </summary>
    /// <param name="childMitgliedId">Child mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of parent mitglieder</returns>
    Task<IEnumerable<Mitglied>> GetParentsAsync(int childMitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a family relationship already exists
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="parentMitgliedId">Parent mitglied ID</param>
    /// <param name="familienbeziehungTypId">Relationship type ID</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if relationship exists, false otherwise</returns>
    Task<bool> RelationshipExistsAsync(int mitgliedId, int parentMitgliedId, int familienbeziehungTypId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if creating a relationship would create a circular reference
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID (child)</param>
    /// <param name="parentMitgliedId">Parent mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if would create circular reference, false otherwise</returns>
    Task<bool> WouldCreateCircularReferenceAsync(int mitgliedId, int parentMitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets count of family relationships by mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="asChild">Count relationships where mitglied is child</param>
    /// <param name="asParent">Count relationships where mitglied is parent</param>
    /// <param name="activeOnly">Count only active relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of family relationships</returns>
    Task<int> GetCountByMitgliedAsync(int mitgliedId, bool asChild = true, bool asParent = true, bool activeOnly = true, CancellationToken cancellationToken = default);
}
