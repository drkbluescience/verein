using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for VeranstaltungBild entity operations
/// </summary>
public interface IVeranstaltungBildRepository : IRepository<VeranstaltungBild>
{
    /// <summary>
    /// Gets images by event ID
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of event images ordered by sort order</returns>
    Task<IEnumerable<VeranstaltungBild>> GetByEventIdAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the main image for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Main event image or null if not found</returns>
    Task<VeranstaltungBild?> GetMainImageAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets images by sort order range
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="minSortOrder">Minimum sort order</param>
    /// <param name="maxSortOrder">Maximum sort order</param>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of event images within the sort order range</returns>
    Task<IEnumerable<VeranstaltungBild>> GetBySortOrderRangeAsync(int eventId, int minSortOrder, int maxSortOrder, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets images by image path pattern
    /// </summary>
    /// <param name="pathPattern">Path pattern to search for</param>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of images matching the path pattern</returns>
    Task<IEnumerable<VeranstaltungBild>> GetByPathPatternAsync(string pathPattern, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a main image exists for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="excludeId">Image ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if main image exists, false otherwise</returns>
    Task<bool> MainImageExistsAsync(int eventId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the next available sort order for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Next available sort order number</returns>
    Task<int> GetNextSortOrderAsync(int eventId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets images with duplicate sort orders for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of images with duplicate sort orders</returns>
    Task<IEnumerable<VeranstaltungBild>> GetDuplicateSortOrdersAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Reorders images for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="imageOrders">Dictionary of image ID to new sort order</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the async operation</returns>
    Task ReorderImagesAsync(int eventId, Dictionary<int, int> imageOrders, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all main images across events
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of main images</returns>
    Task<IEnumerable<VeranstaltungBild>> GetAllMainImagesAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches images by title or description
    /// </summary>
    /// <param name="searchTerm">Search term to match against title and description</param>
    /// <param name="eventId">Optional event ID filter</param>
    /// <param name="includeDeleted">Whether to include soft-deleted images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching images</returns>
    Task<IEnumerable<VeranstaltungBild>> SearchImagesAsync(string searchTerm, int? eventId = null, bool includeDeleted = false, CancellationToken cancellationToken = default);
}
