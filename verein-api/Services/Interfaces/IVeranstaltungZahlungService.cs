using VereinsApi.DTOs.VeranstaltungZahlung;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for VeranstaltungZahlung business operations
/// </summary>
public interface IVeranstaltungZahlungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new veranstaltung zahlung
    /// </summary>
    Task<VeranstaltungZahlungDto> CreateAsync(CreateVeranstaltungZahlungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltung zahlung by ID
    /// </summary>
    Task<VeranstaltungZahlungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all veranstaltung zahlungen
    /// </summary>
    Task<IEnumerable<VeranstaltungZahlungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing veranstaltung zahlung
    /// </summary>
    Task<VeranstaltungZahlungDto> UpdateAsync(int id, UpdateVeranstaltungZahlungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a veranstaltung zahlung
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all zahlungen for a specific veranstaltung
    /// </summary>
    Task<IEnumerable<VeranstaltungZahlungDto>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all zahlungen for a specific anmeldung
    /// </summary>
    Task<IEnumerable<VeranstaltungZahlungDto>> GetByAnmeldungIdAsync(int anmeldungId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by date range
    /// </summary>
    Task<IEnumerable<VeranstaltungZahlungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a veranstaltung
    /// </summary>
    Task<decimal> GetTotalPaymentAmountAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all zahlungen for a specific mitglied (through anmeldung)
    /// </summary>
    Task<IEnumerable<VeranstaltungZahlungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}

