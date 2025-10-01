using VereinsApi.DTOs.VeranstaltungAnmeldung;
using VereinsApi.Common.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for VeranstaltungAnmeldung business operations
/// </summary>
public interface IVeranstaltungAnmeldungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new veranstaltung anmeldung
    /// </summary>
    /// <param name="createDto">VeranstaltungAnmeldung creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created veranstaltung anmeldung</returns>
    Task<VeranstaltungAnmeldungDto> CreateAsync(CreateVeranstaltungAnmeldungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltung anmeldung by ID
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>VeranstaltungAnmeldung or null if not found</returns>
    Task<VeranstaltungAnmeldungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all veranstaltung anmeldungen
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted anmeldungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltung anmeldungen</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing veranstaltung anmeldung
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated veranstaltung anmeldung</returns>
    Task<VeranstaltungAnmeldungDto> UpdateAsync(int id, UpdateVeranstaltungAnmeldungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a veranstaltung anmeldung
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes a veranstaltung anmeldung (permanent deletion)
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets anmeldungen by Veranstaltung ID
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted anmeldungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of anmeldungen for the veranstaltung</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets anmeldungen by Mitglied ID
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted anmeldungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of anmeldungen for the mitglied</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets anmeldungen by status
    /// </summary>
    /// <param name="statusId">Status ID</param>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of anmeldungen with the specified status</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByStatusAsync(int statusId, int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets anmeldungen within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of anmeldungen within the date range</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active anmeldungen
    /// </summary>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active anmeldungen</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetActiveAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets confirmed anmeldungen
    /// </summary>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of confirmed anmeldungen</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetConfirmedAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets waitlisted anmeldungen
    /// </summary>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of waitlisted anmeldungen</returns>
    Task<IEnumerable<VeranstaltungAnmeldungDto>> GetWaitlistedAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Registers a mitglied for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="bemerkung">Optional registration note</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration result</returns>
    Task<VeranstaltungAnmeldungDto> RegisterAsync(int veranstaltungId, int mitgliedId, string? bemerkung = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cancels a registration
    /// </summary>
    /// <param name="anmeldungId">Anmeldung ID</param>
    /// <param name="reason">Cancellation reason</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if cancellation was successful</returns>
    Task<bool> CancelRegistrationAsync(int anmeldungId, string? reason = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Confirms a registration
    /// </summary>
    /// <param name="anmeldungId">Anmeldung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if confirmation was successful</returns>
    Task<bool> ConfirmRegistrationAsync(int anmeldungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Moves a registration from waitlist to confirmed
    /// </summary>
    /// <param name="anmeldungId">Anmeldung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> MoveFromWaitlistAsync(int anmeldungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a mitglied is already registered for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if already registered</returns>
    Task<bool> IsAlreadyRegisteredAsync(int veranstaltungId, int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if registration is possible for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if registration is possible</returns>
    Task<bool> CanRegisterAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registration count for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="activeOnly">Whether to count only active registrations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of registrations</returns>
    Task<int> GetRegistrationCountAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets waitlist count for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of waitlisted registrations</returns>
    Task<int> GetWaitlistCountAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    #endregion

    #region Statistics

    /// <summary>
    /// Gets registration statistics for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration statistics</returns>
    Task<object> GetRegistrationStatisticsAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets registration statistics for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration statistics for the mitglied</returns>
    Task<object> GetMitgliedRegistrationStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default);

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paged veranstaltung anmeldungen
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted anmeldungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paged result of veranstaltung anmeldungen</returns>
    Task<PagedResult<VeranstaltungAnmeldungDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}
