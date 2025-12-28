using VereinsApi.DTOs.DurchlaufendePosten;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for DurchlaufendePosten (Transit Items) business operations
/// </summary>
public interface IDurchlaufendePostenService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new transit item
    /// </summary>
    Task<DurchlaufendePostenDto> CreateAsync(CreateDurchlaufendePostenDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets transit item by ID
    /// </summary>
    Task<DurchlaufendePostenDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all transit items
    /// </summary>
    Task<IEnumerable<DurchlaufendePostenDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing transit item
    /// </summary>
    Task<DurchlaufendePostenDto> UpdateAsync(int id, UpdateDurchlaufendePostenDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a transit item
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all transit items for a specific Verein
    /// </summary>
    Task<IEnumerable<DurchlaufendePostenDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets transit items by status
    /// </summary>
    Task<IEnumerable<DurchlaufendePostenDto>> GetByStatusAsync(int vereinId, string status, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all open (not fully transferred) transit items
    /// </summary>
    Task<IEnumerable<DurchlaufendePostenDto>> GetOpenAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets transit items by FiBuKonto
    /// </summary>
    Task<IEnumerable<DurchlaufendePostenDto>> GetByFiBuKontoAsync(int vereinId, string fiBuNummer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total open amount for a Verein
    /// </summary>
    Task<decimal> GetTotalOpenAmountAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Closes a transit item (marks as transferred)
    /// </summary>
    Task<DurchlaufendePostenDto> CloseAsync(int id, DateTime ausgabenDatum, decimal ausgabenBetrag, string? referenz = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets summary by recipient
    /// </summary>
    Task<IEnumerable<DurchlaufendePostenSummaryDto>> GetEmpfaengerSummaryAsync(int vereinId, CancellationToken cancellationToken = default);

    #endregion
}

/// <summary>
/// Summary DTO for transit items by recipient
/// </summary>
public class DurchlaufendePostenSummaryDto
{
    public string Empfaenger { get; set; } = string.Empty;
    public decimal TotalEinnahmen { get; set; }
    public decimal TotalAusgaben { get; set; }
    public decimal OffenerBetrag { get; set; }
    public int AnzahlPosten { get; set; }
}

