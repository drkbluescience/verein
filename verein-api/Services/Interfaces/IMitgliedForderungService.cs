using VereinsApi.DTOs.MitgliedForderung;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for MitgliedForderung business operations
/// </summary>
public interface IMitgliedForderungService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new forderung
    /// </summary>
    Task<MitgliedForderungDto> CreateAsync(CreateMitgliedForderungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderung by ID
    /// </summary>
    Task<MitgliedForderungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all forderungen
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing forderung
    /// </summary>
    Task<MitgliedForderungDto> UpdateAsync(int id, UpdateMitgliedForderungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a forderung
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all forderungen for a specific mitglied
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all forderungen for a specific verein
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all unpaid forderungen
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetUnpaidAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all overdue forderungen
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetOverdueAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by year
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetByJahrAsync(int jahr, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by year and month
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetByJahrMonatAsync(int jahr, int monat, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderungen by due date range
    /// </summary>
    Task<IEnumerable<MitgliedForderungDto>> GetByDueDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets forderung by forderungsnummer
    /// </summary>
    Task<MitgliedForderungDto?> GetByForderungsnummerAsync(string forderungsnummer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total unpaid amount for a mitglied
    /// </summary>
    Task<decimal> GetTotalUnpaidAmountAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total unpaid amount for a verein
    /// </summary>
    Task<decimal> GetTotalUnpaidAmountByVereinAsync(int vereinId, CancellationToken cancellationToken = default);

    #endregion
}

