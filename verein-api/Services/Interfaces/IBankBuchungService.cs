using VereinsApi.DTOs.BankBuchung;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for BankBuchung business operations
/// </summary>
public interface IBankBuchungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new bank buchung
    /// </summary>
    Task<BankBuchungDto> CreateAsync(CreateBankBuchungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank buchung by ID
    /// </summary>
    Task<BankBuchungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all bank buchungen
    /// </summary>
    Task<IEnumerable<BankBuchungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing bank buchung
    /// </summary>
    Task<BankBuchungDto> UpdateAsync(int id, UpdateBankBuchungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a bank buchung
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all buchungen for a specific verein
    /// </summary>
    Task<IEnumerable<BankBuchungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all buchungen for a specific bank account
    /// </summary>
    Task<IEnumerable<BankBuchungDto>> GetByBankKontoIdAsync(int bankKontoId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets buchungen by date range
    /// </summary>
    Task<IEnumerable<BankBuchungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? bankKontoId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unmatched buchungen (not linked to any payment)
    /// </summary>
    Task<IEnumerable<BankBuchungDto>> GetUnmatchedAsync(int? bankKontoId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total amount for a bank account
    /// </summary>
    Task<decimal> GetTotalAmountAsync(int bankKontoId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    #endregion
}

