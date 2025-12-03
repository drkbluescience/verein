using VereinsApi.DTOs.Brief;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for BriefVorlage (Letter Template) business operations
/// </summary>
public interface IBriefVorlageService
{
    /// <summary>
    /// Creates a new letter template
    /// </summary>
    Task<BriefVorlageDto> CreateAsync(CreateBriefVorlageDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a letter template by ID
    /// </summary>
    Task<BriefVorlageDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all letter templates for a specific Verein
    /// </summary>
    Task<IEnumerable<BriefVorlageDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all active letter templates for a specific Verein
    /// </summary>
    Task<IEnumerable<BriefVorlageDto>> GetActiveByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets letter templates by category for a specific Verein
    /// </summary>
    Task<IEnumerable<BriefVorlageDto>> GetByCategoryAsync(int vereinId, string kategorie, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing letter template
    /// </summary>
    Task<BriefVorlageDto> UpdateAsync(int id, UpdateBriefVorlageDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a letter template
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all available categories
    /// </summary>
    Task<IEnumerable<string>> GetCategoriesAsync(int vereinId, CancellationToken cancellationToken = default);
}

