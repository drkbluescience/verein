using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for BankBuchung entity with specific operations
/// </summary>
public interface IBankBuchungRepository : IRepository<BankBuchung>
{
    /// <summary>
    /// Gets buchungen by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted buchungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of buchungen</returns>
    Task<IEnumerable<BankBuchung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets buchungen by bank account ID
    /// </summary>
    /// <param name="bankKontoId">BankKonto ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted buchungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of buchungen</returns>
    Task<IEnumerable<BankBuchung>> GetByBankKontoIdAsync(int bankKontoId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets buchungen by transaction date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="bankKontoId">BankKonto ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of buchungen</returns>
    Task<IEnumerable<BankBuchung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? bankKontoId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unmatched buchungen (not linked to any payment)
    /// </summary>
    /// <param name="bankKontoId">BankKonto ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of unmatched buchungen</returns>
    Task<IEnumerable<BankBuchung>> GetUnmatchedAsync(int? bankKontoId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets buchung with related payments
    /// </summary>
    /// <param name="id">Buchung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Buchung with payments or null if not found</returns>
    Task<BankBuchung?> GetWithPaymentsAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total transaction amount for a bank account
    /// </summary>
    /// <param name="bankKontoId">BankKonto ID</param>
    /// <param name="fromDate">Start date (optional)</param>
    /// <param name="toDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total transaction amount</returns>
    Task<decimal> GetTotalAmountAsync(int bankKontoId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);
}

