using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for VereinDitibZahlung entity with specific operations
/// </summary>
public interface IVereinDitibZahlungRepository : IRepository<VereinDitibZahlung>
{
    /// <summary>
    /// Gets zahlungen by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted zahlungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VereinDitibZahlung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VereinDitibZahlung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by payment period
    /// </summary>
    /// <param name="zahlungsperiode">Payment period (e.g., "2024-11")</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VereinDitibZahlung>> GetByZahlungsperiodeAsync(string zahlungsperiode, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by status
    /// </summary>
    /// <param name="statusId">Status ID</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VereinDitibZahlung>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="fromDate">Start date (optional)</param>
    /// <param name="toDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total payment amount</returns>
    Task<decimal> GetTotalPaymentAmountAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pending (open) zahlungen
    /// </summary>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of pending zahlungen</returns>
    Task<IEnumerable<VereinDitibZahlung>> GetPendingAsync(int? vereinId = null, CancellationToken cancellationToken = default);
}

