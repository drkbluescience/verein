using VereinsApi.Domain.Entities;

namespace VereinsApi.Domain.Interfaces;

/// <summary>
/// Repository interface for VeranstaltungZahlung entity with specific operations
/// </summary>
public interface IVeranstaltungZahlungRepository : IRepository<VeranstaltungZahlung>
{
    /// <summary>
    /// Gets zahlungen by veranstaltung ID
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted zahlungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VeranstaltungZahlung>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by anmeldung ID
    /// </summary>
    /// <param name="anmeldungId">Anmeldung ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted zahlungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VeranstaltungZahlung>> GetByAnmeldungIdAsync(int anmeldungId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by payment date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="veranstaltungId">Veranstaltung ID to filter by (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen</returns>
    Task<IEnumerable<VeranstaltungZahlung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total payment amount</returns>
    Task<decimal> GetTotalPaymentAmountAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlung with related veranstaltung and anmeldung
    /// </summary>
    /// <param name="id">Zahlung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Zahlung with related data or null if not found</returns>
    Task<VeranstaltungZahlung?> GetWithRelatedDataAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by mitglied ID (through anmeldung)
    /// </summary>
    /// <param name="mitgliedId">Mitglied ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted zahlungen</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of zahlungen with related data</returns>
    Task<IEnumerable<VeranstaltungZahlung>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);
}

