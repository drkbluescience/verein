using VereinsApi.DTOs.PageNote;
using VereinsApi.Domain.Enums;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for PageNote business operations
/// </summary>
public interface IPageNoteService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new page note
    /// </summary>
    /// <param name="createDto">Page note creation data</param>
    /// <param name="userEmail">Email of the user creating the note</param>
    /// <param name="userName">Name of the user creating the note</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created page note</returns>
    Task<PageNoteDto> CreateAsync(CreatePageNoteDto createDto, string userEmail, string? userName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets page note by ID
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Page note or null if not found</returns>
    Task<PageNoteDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all page notes (Admin only)
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of page notes</returns>
    Task<IEnumerable<PageNoteDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing page note
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated page note</returns>
    Task<PageNoteDto> UpdateAsync(int id, UpdatePageNoteDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a page note
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets notes by user email
    /// </summary>
    /// <param name="userEmail">User email address</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNoteDto>> GetByUserEmailAsync(string userEmail, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by page URL
    /// </summary>
    /// <param name="pageUrl">Page URL</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNoteDto>> GetByPageUrlAsync(string pageUrl, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by entity type and ID
    /// </summary>
    /// <param name="entityType">Entity type (Verein, Mitglied, etc.)</param>
    /// <param name="entityId">Entity identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNoteDto>> GetByEntityAsync(string entityType, int entityId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by status
    /// </summary>
    /// <param name="status">Note status</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNoteDto>> GetByStatusAsync(PageNoteStatus status, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by category
    /// </summary>
    /// <param name="category">Note category</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNoteDto>> GetByCategoryAsync(PageNoteCategory category, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by priority
    /// </summary>
    /// <param name="priority">Note priority</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNoteDto>> GetByPriorityAsync(PageNotePriority priority, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion

    #region Admin Operations

    /// <summary>
    /// Completes a page note (Admin only)
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <param name="completeDto">Completion data</param>
    /// <param name="adminEmail">Email of the admin completing the note</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated page note</returns>
    Task<PageNoteDto> CompleteNoteAsync(int id, CompletePageNoteDto completeDto, string adminEmail, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets note statistics (Admin only)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Page note statistics</returns>
    Task<PageNoteStatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default);

    #endregion
}

