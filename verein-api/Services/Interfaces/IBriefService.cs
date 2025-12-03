using VereinsApi.DTOs.Brief;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Brief (Letter Draft) business operations
/// </summary>
public interface IBriefService
{
    /// <summary>
    /// Creates a new letter draft
    /// </summary>
    Task<BriefDto> CreateAsync(CreateBriefDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a letter draft by ID
    /// </summary>
    Task<BriefDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all letter drafts for a specific Verein
    /// </summary>
    Task<IEnumerable<BriefDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all drafts (Entwurf status) for a specific Verein
    /// </summary>
    Task<IEnumerable<BriefDto>> GetDraftsByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all sent letters (Gesendet status) for a specific Verein
    /// </summary>
    Task<IEnumerable<BriefDto>> GetSentByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing letter draft
    /// </summary>
    Task<BriefDto> UpdateAsync(int id, UpdateBriefDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a letter draft
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a letter to specified members
    /// </summary>
    Task<IEnumerable<NachrichtDto>> SendAsync(SendBriefDto sendDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates and sends a letter in one step
    /// </summary>
    Task<IEnumerable<NachrichtDto>> QuickSendAsync(QuickSendBriefDto quickSendDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets statistics for a specific Verein
    /// </summary>
    Task<BriefStatisticsDto> GetStatisticsAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Replaces placeholders in content with member data
    /// </summary>
    Task<string> ReplacePlaceholdersAsync(string content, int mitgliedId, int vereinId, CancellationToken cancellationToken = default);
}

