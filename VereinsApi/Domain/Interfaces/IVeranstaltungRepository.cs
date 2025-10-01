using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Models;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Veranstaltung entity operations
/// </summary>
public interface IVeranstaltungRepository : IRepository<Veranstaltung>
{
    /// <summary>
    /// Gets events by verein ID
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of events</returns>
    Task<IEnumerable<Veranstaltung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);



    /// <summary>
    /// Gets upcoming events
    /// </summary>
    /// <param name="fromDate">Start date filter (optional)</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of upcoming events</returns>
    Task<IEnumerable<Veranstaltung>> GetUpcomingEventsAsync(DateTime? fromDate = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets past events
    /// </summary>
    /// <param name="toDate">End date filter (optional)</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of past events</returns>
    Task<IEnumerable<Veranstaltung>> GetPastEventsAsync(DateTime? toDate = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets events within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of events within the date range</returns>
    Task<IEnumerable<Veranstaltung>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets events by location
    /// </summary>
    /// <param name="location">Location to search for</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of events at the specified location</returns>
    Task<IEnumerable<Veranstaltung>> GetByLocationAsync(string location, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets events that require registration
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of events that require registration</returns>
    Task<IEnumerable<Veranstaltung>> GetEventsRequiringRegistrationAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets events that are only for members
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of member-only events</returns>
    Task<IEnumerable<Veranstaltung>> GetMemberOnlyEventsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets events with available spots
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of events with available spots</returns>
    Task<IEnumerable<Veranstaltung>> GetEventsWithAvailableSpotsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches events by various criteria
    /// </summary>
    /// <param name="searchTerm">Search term to match against title, description, location, etc.</param>
    /// <param name="vereinId">Optional verein ID filter</param>

    /// <param name="startDate">Optional start date filter</param>
    /// <param name="endDate">Optional end date filter</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching events</returns>
    Task<IEnumerable<Veranstaltung>> SearchEventsAsync(string searchTerm, int? vereinId = null, DateTime? startDate = null, DateTime? endDate = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets events by price range
    /// </summary>
    /// <param name="minPrice">Minimum price (optional)</param>
    /// <param name="maxPrice">Maximum price (optional)</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of events within the price range</returns>
    Task<IEnumerable<Veranstaltung>> GetEventsByPriceRangeAsync(decimal? minPrice = null, decimal? maxPrice = null, bool includeDeleted = false, CancellationToken cancellationToken = default);



    /// <summary>
    /// Gets popular events (by registration count)
    /// </summary>
    /// <param name="limit">Maximum number of events to return</param>
    /// <param name="includeDeleted">Whether to include soft-deleted events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of popular events</returns>
    Task<IEnumerable<Veranstaltung>> GetPopularEventsAsync(int limit = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if an event conflicts with existing events for the same verein
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="startDateTime">Event start date and time</param>
    /// <param name="endDateTime">Event end date and time (optional)</param>
    /// <param name="excludeId">Event ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if conflict exists, false otherwise</returns>
    Task<bool> HasScheduleConflictAsync(int vereinId, DateTime startDateTime, DateTime? endDateTime = null, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets event statistics for a verein
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="year">Year for statistics (optional, defaults to current year)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Event statistics</returns>
    Task<EventStatistics> GetEventStatisticsAsync(int vereinId, int? year = null, CancellationToken cancellationToken = default);
}
