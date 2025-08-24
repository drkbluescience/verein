using VereinsApi.Domain.Entities;

namespace VereinsApi.Services;

/// <summary>
/// Service interface for Association business logic
/// </summary>
public interface IAssociationService
{
    /// <summary>
    /// Gets all associations
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of associations</returns>
    Task<IEnumerable<Association>> GetAllAssociationsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets association by ID
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association or null if not found</returns>
    Task<Association?> GetAssociationByIdAsync(int id, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets association by association number
    /// </summary>
    /// <param name="associationNumber">Association number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association or null if not found</returns>
    Task<Association?> GetAssociationByNumberAsync(string associationNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets association by client code
    /// </summary>
    /// <param name="clientCode">Client code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association or null if not found</returns>
    Task<Association?> GetAssociationByClientCodeAsync(string clientCode, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches associations by name
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching associations</returns>
    Task<IEnumerable<Association>> SearchAssociationsAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active associations only
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active associations</returns>
    Task<IEnumerable<Association>> GetActiveAssociationsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated associations
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated associations</returns>
    Task<(IEnumerable<Association> Associations, int TotalCount)> GetPaginatedAssociationsAsync(
        int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new association
    /// </summary>
    /// <param name="association">Association to create</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created association</returns>
    Task<Association> CreateAssociationAsync(Association association, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing association
    /// </summary>
    /// <param name="association">Association to update</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated association</returns>
    Task<Association> UpdateAssociationAsync(Association association, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task DeleteAssociationAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Permanently deletes an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task HardDeleteAssociationAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task ActivateAssociationAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivates an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task DeactivateAssociationAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates association data
    /// </summary>
    /// <param name="association">Association to validate</param>
    /// <param name="isUpdate">Whether this is an update operation</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<(bool IsValid, List<string> Errors)> ValidateAssociationAsync(Association association, bool isUpdate = false, CancellationToken cancellationToken = default);

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
}
