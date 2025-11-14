using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Enums;
using VereinsApi.DTOs.PageNote;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for PageNote entity operations
/// </summary>
public interface IPageNoteRepository : IRepository<PageNote>
{
    /// <summary>
    /// Gets notes by user email
    /// </summary>
    /// <param name="userEmail">User email address</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNote>> GetByUserEmailAsync(string userEmail, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by page URL
    /// </summary>
    /// <param name="pageUrl">Page URL</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNote>> GetByPageUrlAsync(string pageUrl, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by entity type and ID
    /// </summary>
    /// <param name="entityType">Entity type (Verein, Mitglied, etc.)</param>
    /// <param name="entityId">Entity identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNote>> GetByEntityAsync(string entityType, int entityId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by status
    /// </summary>
    /// <param name="status">Note status</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNote>> GetByStatusAsync(PageNoteStatus status, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by category
    /// </summary>
    /// <param name="category">Note category</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNote>> GetByCategoryAsync(PageNoteCategory category, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets notes by priority
    /// </summary>
    /// <param name="priority">Note priority</param>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of notes</returns>
    Task<IEnumerable<PageNote>> GetByPriorityAsync(PageNotePriority priority, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all notes (Admin only)
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted notes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of all notes</returns>
    Task<IEnumerable<PageNote>> GetAllNotesAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets note statistics
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Page note statistics</returns>
    Task<PageNoteStatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default);
}

