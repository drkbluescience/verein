using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Models;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for VeranstaltungAnmeldung entity operations
/// </summary>
public interface IVeranstaltungAnmeldungRepository : IRepository<VeranstaltungAnmeldung>
{
    /// <summary>
    /// Gets registrations by event ID
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of event registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetByEventIdAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registrations by member ID
    /// </summary>
    /// <param name="memberId">Member identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of member registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetByMemberIdAsync(int memberId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registrations by status
    /// </summary>
    /// <param name="status">Registration status</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of registrations with specified status</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetByStatusAsync(string status, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registrations by payment status
    /// </summary>
    /// <param name="paymentStatusId">Payment status identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of registrations with specified payment status</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetByPaymentStatusAsync(int paymentStatusId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registrations within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of registrations within the date range</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetRegistrationsByDateRangeAsync(DateTime startDate, DateTime endDate, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets confirmed registrations for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of confirmed registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetConfirmedRegistrationsAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pending registrations for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of pending registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetPendingRegistrationsAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets cancelled registrations for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of cancelled registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetCancelledRegistrationsAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches registrations by various criteria
    /// </summary>
    /// <param name="searchTerm">Search term to match against name, email, etc.</param>
    /// <param name="eventId">Optional event ID filter</param>
    /// <param name="memberId">Optional member ID filter</param>
    /// <param name="status">Optional status filter</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> SearchRegistrationsAsync(string searchTerm, int? eventId = null, int? memberId = null, string? status = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registration count for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="status">Optional status filter</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration count</returns>
    Task<int> GetRegistrationCountAsync(int eventId, string? status = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a member is already registered for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="memberId">Member identifier</param>
    /// <param name="excludeId">Registration ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if member is registered, false otherwise</returns>
    Task<bool> IsMemberRegisteredAsync(int eventId, int memberId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if an email is already registered for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="email">Email address</param>
    /// <param name="excludeId">Registration ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if email is registered, false otherwise</returns>
    Task<bool> IsEmailRegisteredAsync(int eventId, string email, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registration statistics for an event
    /// </summary>
    /// <param name="eventId">Event identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration statistics</returns>
    Task<RegistrationStatistics> GetRegistrationStatisticsAsync(int eventId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registrations by price range
    /// </summary>
    /// <param name="minPrice">Minimum price (optional)</param>
    /// <param name="maxPrice">Maximum price (optional)</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of registrations within the price range</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetRegistrationsByPriceRangeAsync(decimal? minPrice = null, decimal? maxPrice = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets recent registrations
    /// </summary>
    /// <param name="days">Number of days to look back</param>
    /// <param name="limit">Maximum number of registrations to return</param>
    /// <param name="includeDeleted">Whether to include soft-deleted registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of recent registrations</returns>
    Task<IEnumerable<VeranstaltungAnmeldung>> GetRecentRegistrationsAsync(int days = 7, int limit = 50, bool includeDeleted = false, CancellationToken cancellationToken = default);
}
