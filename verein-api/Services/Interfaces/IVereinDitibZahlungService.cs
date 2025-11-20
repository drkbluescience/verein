using VereinsApi.DTOs.VereinDitibZahlung;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for VereinDitibZahlung business operations
/// </summary>
public interface IVereinDitibZahlungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new DITIB zahlung
    /// </summary>
    Task<VereinDitibZahlungDto> CreateAsync(CreateVereinDitibZahlungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlung by ID
    /// </summary>
    Task<VereinDitibZahlungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all zahlungen
    /// </summary>
    Task<IEnumerable<VereinDitibZahlungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing zahlung
    /// </summary>
    Task<VereinDitibZahlungDto> UpdateAsync(int id, UpdateVereinDitibZahlungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a zahlung
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all zahlungen for a specific verein
    /// </summary>
    Task<IEnumerable<VereinDitibZahlungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by date range
    /// </summary>
    Task<IEnumerable<VereinDitibZahlungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by payment period
    /// </summary>
    Task<IEnumerable<VereinDitibZahlungDto>> GetByZahlungsperiodeAsync(string zahlungsperiode, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets zahlungen by status
    /// </summary>
    Task<IEnumerable<VereinDitibZahlungDto>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total payment amount for a verein
    /// </summary>
    Task<decimal> GetTotalPaymentAmountAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pending (open) zahlungen
    /// </summary>
    Task<IEnumerable<VereinDitibZahlungDto>> GetPendingAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    #endregion
}

