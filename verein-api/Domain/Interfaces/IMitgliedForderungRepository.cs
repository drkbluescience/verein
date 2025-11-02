using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for MitgliedForderung entity with specific operations
/// </summary>
public interface IMitgliedForderungRepository : IRepository<MitgliedForderung>
{
    /// <summary>
    /// Gets forderungen by mitglied ID
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted forderungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted forderungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unpaid forderungen
    /// </summary>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of unpaid forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetUnpaidAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets overdue forderungen (past due date and not paid)
    /// </summary>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of overdue forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetOverdueAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by year
    /// </summary>
    /// <param name="jahr">Year</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetByJahrAsync(int jahr, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by year and month
    /// </summary>
    /// <param name="jahr">Year</param>
    /// <param name="monat">Month (1-12)</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetByJahrMonatAsync(int jahr, int monat, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by due date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="vereinId">Verein ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of forderungen</returns>
    Task<IEnumerable<MitgliedForderung>> GetByDueDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderung by forderungsnummer
    /// </summary>
    /// <param name="forderungsnummer">Forderung number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Forderung or null if not found</returns>
    Task<MitgliedForderung?> GetByForderungsnummerAsync(string forderungsnummer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderung with related payments
    /// </summary>
    /// <param name="id">Forderung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Forderung with payments or null if not found</returns>
    Task<MitgliedForderung?> GetWithPaymentsAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total unpaid amount for a mitglied
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total unpaid amount</returns>
    Task<decimal> GetTotalUnpaidAmountAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total unpaid amount for a verein
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total unpaid amount</returns>
    Task<decimal> GetTotalUnpaidAmountByVereinAsync(int vereinId, CancellationToken cancellationToken = default);
}

