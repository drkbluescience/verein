using VereinsApi.DTOs.RechtlicheDaten;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for RechtlicheDaten business operations
/// </summary>
public interface IRechtlicheDatenService
{
    /// <summary>
    /// Creates new RechtlicheDaten for a Verein
    /// </summary>
    Task<RechtlicheDatenDto> CreateAsync(CreateRechtlicheDatenDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets RechtlicheDaten by ID
    /// </summary>
    Task<RechtlicheDatenDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets RechtlicheDaten by Verein ID
    /// </summary>
    Task<RechtlicheDatenDto?> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates existing RechtlicheDaten
    /// </summary>
    Task<RechtlicheDatenDto> UpdateAsync(int id, UpdateRechtlicheDatenDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes RechtlicheDaten (soft delete)
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all Vereine with expiring Gemeinnützigkeit status
    /// </summary>
    Task<IEnumerable<RechtlicheDatenDto>> GetExpiringGemeinnuetzigkeitAsync(int daysThreshold = 30, CancellationToken cancellationToken = default);
}

