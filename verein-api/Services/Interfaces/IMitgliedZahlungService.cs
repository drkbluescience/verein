using VereinsApi.DTOs.MitgliedZahlung;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for MitgliedZahlung business operations
/// </summary>
public interface IMitgliedZahlungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new zahlung
    /// </summary>
    Task<MitgliedZahlungDto> CreateAsync(CreateMitgliedZahlungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlung by ID
    /// </summary>
    Task<MitgliedZahlungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all zahlungen
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing zahlung
    /// </summary>
    Task<MitgliedZahlungDto> UpdateAsync(int id, UpdateMitgliedZahlungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a zahlung
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all zahlungen for a specific mitglied
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all zahlungen for a specific verein
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by date range
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen for a specific forderung
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetByForderungIdAsync(int forderungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen for a specific bankkonto
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetByBankkontoIdAsync(int bankkontoId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unallocated zahlungen (not linked to any forderung)
    /// </summary>
    Task<IEnumerable<MitgliedZahlungDto>> GetUnallocatedAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a mitglied
    /// </summary>
    Task<decimal> GetTotalPaymentAmountAsync(int mitgliedId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a verein
    /// </summary>
    Task<decimal> GetTotalPaymentAmountByVereinAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    #endregion
}

