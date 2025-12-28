using VereinsApi.DTOs.KassenbuchJahresabschluss;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for KassenbuchJahresabschluss (Year-End Closing) business operations
/// </summary>
public interface IKassenbuchJahresabschlussService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new year-end closing
    /// </summary>
    Task<KassenbuchJahresabschlussDto> CreateAsync(CreateKassenbuchJahresabschlussDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets year-end closing by ID
    /// </summary>
    Task<KassenbuchJahresabschlussDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all year-end closings
    /// </summary>
    Task<IEnumerable<KassenbuchJahresabschlussDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing year-end closing
    /// </summary>
    Task<KassenbuchJahresabschlussDto> UpdateAsync(int id, UpdateKassenbuchJahresabschlussDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a year-end closing
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Business Operations

    /// <summary>
    /// Gets all year-end closings for a specific Verein
    /// </summary>
    Task<IEnumerable<KassenbuchJahresabschlussDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets year-end closing for a specific Verein and year
    /// </summary>
    Task<KassenbuchJahresabschlussDto?> GetByVereinAndJahrAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a year-end closing exists for a Verein and year
    /// </summary>
    Task<bool> ExistsForYearAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks a year-end closing as audited
    /// </summary>
    Task<KassenbuchJahresabschlussDto> MarkAsAuditedAsync(int id, string auditorName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the latest year-end closing for a Verein
    /// </summary>
    Task<KassenbuchJahresabschlussDto?> GetLatestAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates and creates year-end closing based on Kassenbuch entries
    /// </summary>
    Task<KassenbuchJahresabschlussDto> CalculateAndCreateAsync(int vereinId, int jahr, CancellationToken cancellationToken = default);

    #endregion
}

