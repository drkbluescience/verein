using VereinsApi.DTOs.SpendenProtokoll;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for SpendenProtokoll (Donation Protocol) business operations
/// </summary>
public interface ISpendenProtokollService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new donation protocol
    /// </summary>
    Task<SpendenProtokollDto> CreateAsync(CreateSpendenProtokollDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets donation protocol by ID
    /// </summary>
    Task<SpendenProtokollDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all donation protocols
    /// </summary>
    Task<IEnumerable<SpendenProtokollDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing donation protocol
    /// </summary>
    Task<SpendenProtokollDto> UpdateAsync(int id, UpdateSpendenProtokollDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a donation protocol
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all donation protocols for a specific Verein
    /// </summary>
    Task<IEnumerable<SpendenProtokollDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets donation protocols by date range
    /// </summary>
    Task<IEnumerable<SpendenProtokollDto>> GetByDateRangeAsync(int vereinId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets donation protocols by purpose category
    /// </summary>
    Task<IEnumerable<SpendenProtokollDto>> GetByZweckKategorieAsync(int vereinId, string zweckKategorie, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total donations for a Verein by date range
    /// </summary>
    Task<decimal> GetTotalAmountAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets donation summary by category
    /// </summary>
    Task<IEnumerable<SpendenKategorieSummaryDto>> GetKategorieSummaryAsync(int vereinId, int? jahr = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Signs the protocol (witness signature)
    /// </summary>
    Task<SpendenProtokollDto> SignAsync(int id, int zeugeNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Links protocol to a Kassenbuch entry
    /// </summary>
    Task<SpendenProtokollDto> LinkToKassenbuchAsync(int id, int kassenbuchId, CancellationToken cancellationToken = default);

    #endregion
}

/// <summary>
/// Summary DTO for donation categories
/// </summary>
public class SpendenKategorieSummaryDto
{
    public string ZweckKategorie { get; set; } = string.Empty;
    public decimal TotalBetrag { get; set; }
    public int AnzahlProtokolle { get; set; }
}

