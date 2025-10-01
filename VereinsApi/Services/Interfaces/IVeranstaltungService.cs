using VereinsApi.DTOs.Veranstaltung;
using VereinsApi.Common.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Veranstaltung business operations
/// </summary>
public interface IVeranstaltungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new veranstaltung
    /// </summary>
    /// <param name="createDto">Veranstaltung creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created veranstaltung</returns>
    Task<VeranstaltungDto> CreateAsync(CreateVeranstaltungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltung by ID
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Veranstaltung or null if not found</returns>
    Task<VeranstaltungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all veranstaltungen
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted veranstaltungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltungen</returns>
    Task<IEnumerable<VeranstaltungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing veranstaltung
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated veranstaltung</returns>
    Task<VeranstaltungDto> UpdateAsync(int id, UpdateVeranstaltungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a veranstaltung
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes a veranstaltung (permanent deletion)
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets veranstaltungen by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted veranstaltungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltungen for the verein</returns>
    Task<IEnumerable<VeranstaltungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltungen by title (partial match)
    /// </summary>
    /// <param name="title">Title to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching veranstaltungen</returns>
    Task<IEnumerable<VeranstaltungDto>> SearchByTitleAsync(string title, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltungen within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltungen within the date range</returns>
    Task<IEnumerable<VeranstaltungDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets upcoming veranstaltungen
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of upcoming veranstaltungen</returns>
    Task<IEnumerable<VeranstaltungDto>> GetUpcomingAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets past veranstaltungen
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of past veranstaltungen</returns>
    Task<IEnumerable<VeranstaltungDto>> GetPastAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active veranstaltungen
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active veranstaltungen</returns>
    Task<IEnumerable<VeranstaltungDto>> GetActiveAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltungen that require registration
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltungen requiring registration</returns>
    Task<IEnumerable<VeranstaltungDto>> GetRequiringRegistrationAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltungen by location
    /// </summary>
    /// <param name="location">Location to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltungen at the specified location</returns>
    Task<IEnumerable<VeranstaltungDto>> GetByLocationAsync(string location, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltung with full details (including registrations, images, etc.)
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Veranstaltung with full details or null if not found</returns>
    Task<VeranstaltungDto?> GetFullDetailsAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Checks if veranstaltung title is unique for a verein
    /// </summary>
    /// <param name="title">Veranstaltung title</param>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="excludeId">Optional ID to exclude from check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if title is unique</returns>
    Task<bool> IsTitleUniqueAsync(string title, int vereinId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registration count for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="activeOnly">Whether to count only active registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of registrations</returns>
    Task<int> GetRegistrationCountAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets available capacity for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Available capacity (null if unlimited)</returns>
    Task<int?> GetAvailableCapacityAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a veranstaltung has available capacity
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if capacity is available</returns>
    Task<bool> HasAvailableCapacityAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if registration is open for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if registration is open</returns>
    Task<bool> IsRegistrationOpenAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates a veranstaltung
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivates a veranstaltung
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cancels a veranstaltung
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="reason">Cancellation reason</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> CancelAsync(int id, string? reason = null, CancellationToken cancellationToken = default);

    #endregion

    #region Statistics

    /// <summary>
    /// Gets statistics for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Veranstaltung statistics</returns>
    Task<object> GetStatisticsAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets event statistics for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Event statistics for the verein</returns>
    Task<object> GetVereinEventStatisticsAsync(int vereinId, CancellationToken cancellationToken = default);

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paged veranstaltungen
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted veranstaltungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paged result of veranstaltungen</returns>
    Task<PagedResult<VeranstaltungDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}
