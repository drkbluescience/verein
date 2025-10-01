using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.MitgliedAdresse;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Mitglied business operations
/// </summary>
public interface IMitgliedService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new mitglied
    /// </summary>
    /// <param name="createDto">Mitglied creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created mitglied</returns>
    Task<MitgliedDto> CreateAsync(CreateMitgliedDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied by ID
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied or null if not found</returns>
    Task<MitgliedDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all mitglieder
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted mitglieder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing mitglied
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated mitglied</returns>
    Task<MitgliedDto> UpdateAsync(int id, UpdateMitgliedDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a mitglied
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated mitglieder
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted mitglieder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result</returns>
    Task<PagedResult<MitgliedDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Creates a mitglied with initial address
    /// </summary>
    /// <param name="mitgliedDto">Mitglied creation data</param>
    /// <param name="adresseDto">Address creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created mitglied with address</returns>
    Task<MitgliedDto> CreateWithAddressAsync(CreateMitgliedDto mitgliedDto, CreateMitgliedAdresseDto adresseDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied with all related data (addresses, family, events)
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied with full data or null if not found</returns>
    Task<MitgliedDto?> GetFullAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied with addresses only
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied with addresses or null if not found</returns>
    Task<MitgliedDto?> GetWithAddressesAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglied with family relationships only
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Mitglied with family relationships or null if not found</returns>
    Task<MitgliedDto?> GetWithFamilyAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Transfers mitglied to another verein
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="newVereinId">New verein ID</param>
    /// <param name="transferDate">Transfer date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated mitglied</returns>
    Task<MitgliedDto> TransferToVereinAsync(int mitgliedId, int newVereinId, DateTime transferDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates or deactivates a mitglied
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="isActive">Active status</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated mitglied</returns>
    Task<MitgliedDto> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default);

    #endregion

    #region Search and Filter Operations

    /// <summary>
    /// Gets mitglieder by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted mitglieder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches mitglieder by name
    /// </summary>
    /// <param name="vorname">First name (optional)</param>
    /// <param name="nachname">Last name (optional)</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> SearchByNameAsync(string? vorname, string? nachname, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by email
    /// </summary>
    /// <param name="email">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder with this email</returns>
    Task<IEnumerable<MitgliedDto>> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active mitglieder only
    /// </summary>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetActiveMitgliederAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by status
    /// </summary>
    /// <param name="statusId">Member status ID</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder by type
    /// </summary>
    /// <param name="typId">Member type ID</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetByTypAsync(int typId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder who joined within a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetByJoinDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets mitglieder with birthdays in a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of mitglieder</returns>
    Task<IEnumerable<MitgliedDto>> GetByBirthdayRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    #endregion

    #region Validation Operations

    /// <summary>
    /// Checks if member number is unique within a verein
    /// </summary>
    /// <param name="mitgliedsnummer">Member number</param>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if unique, false otherwise</returns>
    Task<bool> IsMitgliedsnummerUniqueAsync(string mitgliedsnummer, int vereinId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates mitglied data for business rules
    /// </summary>
    /// <param name="createDto">Mitglied creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<ValidationResult> ValidateCreateAsync(CreateMitgliedDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates mitglied update data for business rules
    /// </summary>
    /// <param name="id">Mitglied ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Validation result</returns>
    Task<ValidationResult> ValidateUpdateAsync(int id, UpdateMitgliedDto updateDto, CancellationToken cancellationToken = default);

    #endregion

    #region Statistics Operations

    /// <summary>
    /// Gets count of mitglieder by verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Count only active members</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of mitglieder</returns>
    Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets membership statistics for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Membership statistics</returns>
    Task<MembershipStatistics> GetMembershipStatisticsAsync(int vereinId, CancellationToken cancellationToken = default);

    #endregion
}


