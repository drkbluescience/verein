using VereinsApi.DTOs.MitgliedFamilie;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for MitgliedFamilie business operations
/// </summary>
public interface IMitgliedFamilieService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new family relationship
    /// </summary>
    /// <param name="createDto">Family relationship creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created family relationship</returns>
    Task<MitgliedFamilieDto> CreateAsync(CreateMitgliedFamilieDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationship by ID
    /// </summary>
    /// <param name="id">Family relationship ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Family relationship or null if not found</returns>
    Task<MitgliedFamilieDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all family relationships
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing family relationship
    /// </summary>
    /// <param name="id">Family relationship ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated family relationship</returns>
    Task<MitgliedFamilieDto> UpdateAsync(int id, UpdateMitgliedFamilieDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a family relationship
    /// </summary>
    /// <param name="id">Family relationship ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated family relationships
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result</returns>
    Task<PagedResult<MitgliedFamilieDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Creates a family relationship with validation
    /// </summary>
    /// <param name="createDto">Family relationship creation data</param>
    /// <param name="validateCircularReference">Whether to check for circular references</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created family relationship</returns>
    Task<MitgliedFamilieDto> CreateWithValidationAsync(CreateMitgliedFamilieDto createDto, bool validateCircularReference = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates family relationship validity period
    /// </summary>
    /// <param name="relationshipId">Family relationship ID</param>
    /// <param name="gueltigVon">Valid from date</param>
    /// <param name="gueltigBis">Valid until date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated family relationship</returns>
    Task<MitgliedFamilieDto> UpdateValidityPeriodAsync(int relationshipId, DateTime? gueltigVon, DateTime? gueltigBis, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates or deactivates a family relationship
    /// </summary>
    /// <param name="id">Family relationship ID</param>
    /// <param name="isActive">Active status</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated family relationship</returns>
    Task<MitgliedFamilieDto> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default);

    /// <summary>
    /// Ends a family relationship (sets end date)
    /// </summary>
    /// <param name="relationshipId">Family relationship ID</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated family relationship</returns>
    Task<MitgliedFamilieDto> EndRelationshipAsync(int relationshipId, DateTime endDate, CancellationToken cancellationToken = default);

    #endregion

    #region Search and Filter Operations

    /// <summary>
    /// Gets family relationships by mitglied ID (as child)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships where mitglied is the child</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by parent mitglied ID
    /// </summary>
    /// <param name="parentMitgliedId">Parent mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships where mitglied is the parent</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetByParentMitgliedIdAsync(int parentMitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all family relationships for a mitglied (both as child and parent)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of all family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetAllRelationshipsAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted relationships</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by relationship type
    /// </summary>
    /// <param name="familienbeziehungTypId">Family relationship type ID</param>
    /// <param name="vereinId">Optional verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetByRelationshipTypeAsync(int familienbeziehungTypId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships by status
    /// </summary>
    /// <param name="statusId">Family relationship status ID</param>
    /// <param name="vereinId">Optional verein ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets family relationships valid at a specific date
    /// </summary>
    /// <param name="date">Date to check validity</param>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of valid family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active family relationships only
    /// </summary>
    /// <param name="mitgliedId">Optional mitglied ID to filter by</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active family relationships</returns>
    Task<IEnumerable<MitgliedFamilieDto>> GetActiveRelationshipsAsync(int? mitgliedId = null, CancellationToken cancellationToken = default);

    #endregion

    #region Family Tree Operations

    /// <summary>
    /// Gets children of a parent mitglied
    /// </summary>
    /// <param name="parentMitgliedId">Parent mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of child mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetChildrenAsync(int parentMitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets parents of a child mitglied
    /// </summary>
    /// <param name="childMitgliedId">Child mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of parent mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetParentsAsync(int childMitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets siblings of a mitglied (same parents)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of sibling mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetSiblingsAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets complete family tree for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="maxDepth">Maximum depth to traverse (default: 3)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Family tree structure</returns>
    Task<FamilyTree> GetFamilyTreeAsync(int mitgliedId, int maxDepth = 3, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all relatives of a mitglied (parents, children, siblings)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of all relatives</returns>
    Task<IEnumerable<MitgliedDto>> GetAllRelativesAsync(int mitgliedId, CancellationToken cancellationToken = default);

    #endregion

    #region Validation Operations

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
    /// Validates family relationship data for business rules
    /// </summary>
    /// <param name="createDto">Family relationship creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<ValidationResult> ValidateCreateAsync(CreateMitgliedFamilieDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates family relationship update data for business rules
    /// </summary>
    /// <param name="id">Family relationship ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<ValidationResult> ValidateUpdateAsync(int id, UpdateMitgliedFamilieDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates family relationship validity period
    /// </summary>
    /// <param name="gueltigVon">Valid from date</param>
    /// <param name="gueltigBis">Valid until date</param>
    /// <returns>True if validity period is valid</returns>
    bool ValidateValidityPeriod(DateTime? gueltigVon, DateTime? gueltigBis);

    #endregion

    #region Statistics Operations

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

    /// <summary>
    /// Gets family statistics for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Family statistics</returns>
    Task<FamilyStatistics> GetFamilyStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default);

    #endregion
}


