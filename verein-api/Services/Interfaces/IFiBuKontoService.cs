using VereinsApi.DTOs.FiBuKonto;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for FiBuKonto (Financial Account) business operations
/// </summary>
public interface IFiBuKontoService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new FiBuKonto
    /// </summary>
    Task<FiBuKontoDto> CreateAsync(CreateFiBuKontoDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets FiBuKonto by ID
    /// </summary>
    Task<FiBuKontoDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all FiBuKonten
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing FiBuKonto
    /// </summary>
    Task<FiBuKontoDto> UpdateAsync(int id, UpdateFiBuKontoDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a FiBuKonto
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets FiBuKonto by account number
    /// </summary>
    Task<FiBuKontoDto?> GetByNummerAsync(string nummer, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all FiBuKonten by type (EINNAHMEN, AUSGABEN, EIN_AUSG)
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetByTypAsync(string typ, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all FiBuKonten by payment type
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetByZahlungTypIdAsync(int zahlungTypId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all income accounts (Einnahmen)
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetEinnahmenKontenAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all expense accounts (Ausgaben)
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetAusgabenKontenAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all transit accounts (Durchlaufende Posten)
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetDurchlaufendePostenKontenAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all active FiBuKonten
    /// </summary>
    Task<IEnumerable<FiBuKontoDto>> GetActiveAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets active status of a FiBuKonto
    /// </summary>
    Task<bool> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if account number exists
    /// </summary>
    Task<bool> NummerExistsAsync(string nummer, int? excludeId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets accounts grouped by type for reports
    /// </summary>
    Task<Dictionary<string, IEnumerable<FiBuKontoDto>>> GetGroupedByTypAsync(CancellationToken cancellationToken = default);

    #endregion
}

