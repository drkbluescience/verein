using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for Bankkonto entity operations
/// </summary>
public interface IBankkontoRepository : IRepository<Bankkonto>
{
    /// <summary>
    /// Gets bank accounts by verein ID
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bank accounts</returns>
    Task<IEnumerable<Bankkonto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank accounts by account type ID
    /// </summary>
    /// <param name="accountTypeId">Account type identifier</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bank accounts</returns>
    Task<IEnumerable<Bankkonto>> GetByAccountTypeIdAsync(int accountTypeId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank account by IBAN
    /// </summary>
    /// <param name="iban">IBAN to search for</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Bank account with the specified IBAN</returns>
    Task<Bankkonto?> GetByIBANAsync(string iban, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank accounts by bank name
    /// </summary>
    /// <param name="bankName">Bank name</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bank accounts</returns>
    Task<IEnumerable<Bankkonto>> GetByBankNameAsync(string bankName, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets default bank accounts for vereine
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of default bank accounts</returns>
    Task<IEnumerable<Bankkonto>> GetDefaultBankAccountsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank accounts that are valid for a specific date
    /// </summary>
    /// <param name="validDate">Date to check validity against</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bank accounts valid for the specified date</returns>
    Task<IEnumerable<Bankkonto>> GetValidBankAccountsForDateAsync(DateTime validDate, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches bank accounts by various criteria
    /// </summary>
    /// <param name="searchTerm">Search term to match against IBAN, bank name, account holder, etc.</param>
    /// <param name="vereinId">Optional verein ID filter</param>
    /// <param name="accountTypeId">Optional account type ID filter</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching bank accounts</returns>
    Task<IEnumerable<Bankkonto>> SearchBankAccountsAsync(string searchTerm, int? vereinId = null, int? accountTypeId = null, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if an IBAN already exists
    /// </summary>
    /// <param name="iban">IBAN to check</param>
    /// <param name="excludeId">Bank account ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if IBAN exists, false otherwise</returns>
    Task<bool> IBANExistsAsync(string iban, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a default bank account exists for the given verein
    /// </summary>
    /// <param name="vereinId">Verein identifier</param>
    /// <param name="excludeId">Bank account ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if default bank account exists, false otherwise</returns>
    Task<bool> DefaultBankAccountExistsForVereinAsync(int vereinId, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank accounts by BIC
    /// </summary>
    /// <param name="bic">BIC to search for</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bank accounts with the specified BIC</returns>
    Task<IEnumerable<Bankkonto>> GetByBICAsync(string bic, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank accounts by account number (legacy)
    /// </summary>
    /// <param name="accountNumber">Account number to search for</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bank accounts</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bank accounts with the specified account number</returns>
    Task<IEnumerable<Bankkonto>> GetByAccountNumberAsync(string accountNumber, bool includeDeleted = false, CancellationToken cancellationToken = default);
}
