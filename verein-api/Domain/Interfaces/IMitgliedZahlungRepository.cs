using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for MitgliedZahlung entity with specific operations
/// </summary>
public interface IMitgliedZahlungRepository : IRepository<MitgliedZahlung>
{
    /// <summary>
    /// Gets zahlungen by mitglied ID
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted zahlungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<MitgliedZahlung>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted zahlungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<MitgliedZahlung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by payment date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<MitgliedZahlung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by forderung ID
    /// </summary>
    /// <param name="forderungId">Forderung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<MitgliedZahlung>> GetByForderungIdAsync(int forderungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by bank account ID
    /// </summary>
    /// <param name="bankkontoId">Bankkonto ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<MitgliedZahlung>> GetByBankkontoIdAsync(int bankkontoId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unallocated zahlungen (payments not linked to any forderung)
    /// </summary>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of unallocated zahlungen</returns>
    Task<IEnumerable<MitgliedZahlung>> GetUnallocatedAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlung with related forderung and allocations
    /// </summary>
    /// <param name="id">Zahlung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Zahlung with related data or null if not found</returns>
    Task<MitgliedZahlung?> GetWithRelatedDataAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="fromDate">Start date (optional)</param>
    /// <param name="toDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total payment amount</returns>
    Task<decimal> GetTotalPaymentAmountAsync(int mitgliedId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="fromDate">Start date (optional)</param>
    /// <param name="toDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total payment amount</returns>
    Task<decimal> GetTotalPaymentAmountByVereinAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);
}

