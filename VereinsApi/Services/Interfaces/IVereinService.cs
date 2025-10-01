using VereinsApi.DTOs.Verein;
using VereinsApi.Common.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Verein business operations
/// </summary>
public interface IVereinService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new verein
    /// </summary>
    /// <param name="createDto">Verein creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created verein</returns>
    Task<VereinDto> CreateAsync(CreateVereinDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets verein by ID
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verein or null if not found</returns>
    Task<VereinDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all vereine
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted vereine</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of vereine</returns>
    Task<IEnumerable<VereinDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing verein
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated verein</returns>
    Task<VereinDto> UpdateAsync(int id, UpdateVereinDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a verein
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes a verein (permanent deletion)
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets verein by name
    /// </summary>
    /// <param name="name">Verein name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verein or null if not found</returns>
    Task<VereinDto?> GetByNameAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches vereine by name (partial match)
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching vereine</returns>
    Task<IEnumerable<VereinDto>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets vereine by city
    /// </summary>
    /// <param name="city">City name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of vereine in the specified city</returns>
    Task<IEnumerable<VereinDto>> GetByCityAsync(string city, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets vereine by postal code
    /// </summary>
    /// <param name="postalCode">Postal code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of vereine with the specified postal code</returns>
    Task<IEnumerable<VereinDto>> GetByPostalCodeAsync(string postalCode, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets vereine founded within a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of vereine founded within the date range</returns>
    Task<IEnumerable<VereinDto>> GetByFoundingDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active vereine
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active vereine</returns>
    Task<IEnumerable<VereinDto>> GetActiveVereineAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets verein with full details (including addresses, bank accounts, etc.)
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verein with full details or null if not found</returns>
    Task<VereinDto?> GetFullDetailsAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Checks if verein name is unique
    /// </summary>
    /// <param name="name">Verein name</param>
    /// <param name="excludeId">Optional ID to exclude from check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if name is unique</returns>
    Task<bool> IsNameUniqueAsync(string name, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets member count for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Whether to count only active members</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of members</returns>
    Task<int> GetMemberCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets event count for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Whether to count only active events</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of events</returns>
    Task<int> GetEventCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets address count for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Whether to count only active addresses</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of addresses</returns>
    Task<int> GetAddressCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank account count for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Whether to count only active bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of bank accounts</returns>
    Task<int> GetBankAccountCountAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates a verein
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivates a verein
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Statistics

    /// <summary>
    /// Gets basic statistics for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verein statistics</returns>
    Task<object> GetStatisticsAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets overall system statistics
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>System statistics</returns>
    Task<object> GetSystemStatisticsAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paged vereine
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted vereine</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paged result of vereine</returns>
    Task<PagedResult<VereinDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}
