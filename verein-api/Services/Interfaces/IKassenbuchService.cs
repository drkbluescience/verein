using VereinsApi.DTOs.Kassenbuch;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Kassenbuch (Cash Book) business operations
/// </summary>
public interface IKassenbuchService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new Kassenbuch entry
    /// </summary>
    Task<KassenbuchDto> CreateAsync(CreateKassenbuchDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets Kassenbuch entry by ID
    /// </summary>
    Task<KassenbuchDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all Kassenbuch entries
    /// </summary>
    Task<IEnumerable<KassenbuchDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing Kassenbuch entry
    /// </summary>
    Task<KassenbuchDto> UpdateAsync(int id, UpdateKassenbuchDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a Kassenbuch entry
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all Kassenbuch entries for a specific Verein
    /// </summary>
    Task<IEnumerable<KassenbuchDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets Kassenbuch entries by year
    /// </summary>
    Task<IEnumerable<KassenbuchDto>> GetByJahrAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets Kassenbuch entries by date range
    /// </summary>
    Task<IEnumerable<KassenbuchDto>> GetByDateRangeAsync(int vereinId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets Kassenbuch entry by BelegNr
    /// </summary>
    Task<KassenbuchDto?> GetByBelegNrAsync(int vereinId, int jahr, int belegNr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets Kassenbuch entries by FiBuKonto
    /// </summary>
    Task<IEnumerable<KassenbuchDto>> GetByFiBuKontoAsync(int vereinId, string fiBuNummer, int? jahr = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets Kassenbuch entries by Zahlungsweg
    /// </summary>
    Task<IEnumerable<KassenbuchDto>> GetByZahlungswegAsync(int vereinId, string zahlungsweg, int? jahr = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets next available BelegNr for a Verein and year
    /// </summary>
    Task<int> GetNextBelegNrAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total income for a Verein and year
    /// </summary>
    Task<decimal> GetTotalEinnahmenAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total expenses for a Verein and year
    /// </summary>
    Task<decimal> GetTotalAusgabenAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets cash balance for a Verein and year
    /// </summary>
    Task<decimal> GetKasseSaldoAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bank balance for a Verein and year
    /// </summary>
    Task<decimal> GetBankSaldoAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets summary by FiBuKonto for a year (for reports)
    /// </summary>
    Task<IEnumerable<KassenbuchKontoSummaryDto>> GetKontoSummaryAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    #endregion
}

/// <summary>
/// Summary DTO for Kassenbuch account totals
/// </summary>
public class KassenbuchKontoSummaryDto
{
    public string FiBuNummer { get; set; } = string.Empty;
    public string FiBuBezeichnung { get; set; } = string.Empty;
    public decimal TotalEinnahmen { get; set; }
    public decimal TotalAusgaben { get; set; }
    public decimal Saldo { get; set; }
    public int AnzahlBuchungen { get; set; }
}

