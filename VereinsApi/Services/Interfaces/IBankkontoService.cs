using VereinsApi.DTOs.Bankkonto;
using VereinsApi.Common.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Bankkonto business operations
/// </summary>
public interface IBankkontoService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new bankkonto
    /// </summary>
    /// <param name="createDto">Bankkonto creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created bankkonto</returns>
    Task<BankkontoDto> CreateAsync(CreateBankkontoDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bankkonto by ID
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Bankkonto or null if not found</returns>
    Task<BankkontoDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all bankkonten
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted bankkonten</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bankkonten</returns>
    Task<IEnumerable<BankkontoDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing bankkonto
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated bankkonto</returns>
    Task<BankkontoDto> UpdateAsync(int id, UpdateBankkontoDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a bankkonto
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes a bankkonto (permanent deletion)
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets bankkonten by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bankkonten</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bankkonten for the verein</returns>
    Task<IEnumerable<BankkontoDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bankkonto by IBAN
    /// </summary>
    /// <param name="iban">IBAN</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Bankkonto or null if not found</returns>
    Task<BankkontoDto?> GetByIbanAsync(string iban, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bankkonten by bank name
    /// </summary>
    /// <param name="bankName">Bank name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bankkonten with the specified bank name</returns>
    Task<IEnumerable<BankkontoDto>> GetByBankNameAsync(string bankName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bankkonten valid at a specific date
    /// </summary>
    /// <param name="date">Date to check validity</param>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bankkonten valid at the specified date</returns>
    Task<IEnumerable<BankkontoDto>> GetValidAtDateAsync(DateTime date, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active bankkonten
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active bankkonten</returns>
    Task<IEnumerable<BankkontoDto>> GetActiveAccountsAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets standard bank account for a Verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Standard bank account or null if not found</returns>
    Task<BankkontoDto?> GetStandardAccountAsync(int vereinId, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Sets a bank account as standard for a Verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="accountId">Account ID to set as standard</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> SetAsStandardAccountAsync(int vereinId, int accountId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates IBAN format
    /// </summary>
    /// <param name="iban">IBAN to validate</param>
    /// <returns>True if IBAN format is valid</returns>
    bool IsValidIban(string iban);

    /// <summary>
    /// Checks if IBAN is unique
    /// </summary>
    /// <param name="iban">IBAN to check</param>
    /// <param name="excludeId">Optional ID to exclude from check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if IBAN is unique</returns>
    Task<bool> IsIbanUniqueAsync(string iban, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a Verein has any bank accounts
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the Verein has bank accounts</returns>
    Task<bool> HasAccountsAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank account count for a Verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="activeOnly">Whether to count only active accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of bank accounts</returns>
    Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default);

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paged bankkonten
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bankkonten</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paged result of bankkonten</returns>
    Task<PagedResult<BankkontoDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}
