using VereinsApi.DTOs.VereinSatzung;

namespace VereinsApi.Services;

/// <summary>
/// Service interface for VereinSatzung operations
/// </summary>
public interface IVereinSatzungService
{
    /// <summary>
    /// Get all statute versions for a specific Verein
    /// </summary>
    Task<IEnumerable<VereinSatzungDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get active statute for a specific Verein
    /// </summary>
    Task<VereinSatzungDto?> GetActiveByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get statute by ID
    /// </summary>
    Task<VereinSatzungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Create a new statute version
    /// </summary>
    Task<VereinSatzungDto> CreateAsync(CreateVereinSatzungDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update an existing statute
    /// </summary>
    Task<VereinSatzungDto> UpdateAsync(int id, UpdateVereinSatzungDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a statute (soft delete)
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Upload a statute file and create a new version
    /// </summary>
    Task<VereinSatzungDto> UploadSatzungAsync(
        int vereinId,
        byte[] fileContent,
        string fileName,
        string contentType,
        DateTime satzungVom,
        bool setAsActive = true,
        string? bemerkung = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Set a statute version as active (deactivates all others for the same Verein)
    /// </summary>
    Task<bool> SetActiveAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get file content for download
    /// </summary>
    Task<(byte[] content, string fileName, string contentType)?> GetFileAsync(int id, CancellationToken cancellationToken = default);
}

