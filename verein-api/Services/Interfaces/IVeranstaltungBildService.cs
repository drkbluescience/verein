using VereinsApi.DTOs.VeranstaltungBild;
using VereinsApi.Common.Models;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for VeranstaltungBild business operations
/// </summary>
public interface IVeranstaltungBildService
{
    #region CRUD Operations

    /// <summary>
    /// Creates a new veranstaltung bild
    /// </summary>
    /// <param name="createDto">VeranstaltungBild creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created veranstaltung bild</returns>
    Task<VeranstaltungBildDto> CreateAsync(CreateVeranstaltungBildDto createDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets veranstaltung bild by ID
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>VeranstaltungBild or null if not found</returns>
    Task<VeranstaltungBildDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all veranstaltung bilder
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted bilder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of veranstaltung bilder</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing veranstaltung bild
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="updateDto">Update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated veranstaltung bild</returns>
    Task<VeranstaltungBildDto> UpdateAsync(int id, UpdateVeranstaltungBildDto updateDto, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a veranstaltung bild
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Hard deletes a veranstaltung bild (permanent deletion)
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted successfully</returns>
    Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Query Operations

    /// <summary>
    /// Gets bilder by Veranstaltung ID
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bilder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bilder for the veranstaltung</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bilder by file name (partial match)
    /// </summary>
    /// <param name="fileName">File name to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching bilder</returns>
    Task<IEnumerable<VeranstaltungBildDto>> SearchByFileNameAsync(string fileName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bilder by description (partial match)
    /// </summary>
    /// <param name="description">Description to search for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching bilder</returns>
    Task<IEnumerable<VeranstaltungBildDto>> SearchByDescriptionAsync(string description, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bilder by file type
    /// </summary>
    /// <param name="fileType">File type (e.g., "jpg", "png")</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bilder with the specified file type</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetByFileTypeAsync(string fileType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bilder within a file size range
    /// </summary>
    /// <param name="minSize">Minimum file size in bytes</param>
    /// <param name="maxSize">Maximum file size in bytes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bilder within the size range</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetByFileSizeRangeAsync(long minSize, long maxSize, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets bilder uploaded within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of bilder uploaded within the date range</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetByUploadDateRangeAsync(DateTime startDate, DateTime endDate, int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active bilder
    /// </summary>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of active bilder</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetActiveAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets main/featured bilder for veranstaltungen
    /// </summary>
    /// <param name="veranstaltungId">Optional Veranstaltung ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of main bilder</returns>
    Task<IEnumerable<VeranstaltungBildDto>> GetMainBilderAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default);

    #endregion

    #region File Operations

    /// <summary>
    /// Uploads a new image file for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="fileContent">File content as byte array</param>
    /// <param name="fileName">Original file name</param>
    /// <param name="contentType">File content type</param>
    /// <param name="description">Optional description</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created veranstaltung bild</returns>
    Task<VeranstaltungBildDto> UploadImageAsync(int veranstaltungId, byte[] fileContent, string fileName, string contentType, string? description = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets image file content
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>File content as byte array or null if not found</returns>
    Task<byte[]?> GetImageContentAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates image file
    /// </summary>
    /// <param name="fileContent">File content</param>
    /// <param name="fileName">File name</param>
    /// <param name="contentType">Content type</param>
    /// <returns>True if valid image file</returns>
    bool ValidateImageFile(byte[] fileContent, string fileName, string contentType);

    /// <summary>
    /// Gets allowed image file extensions
    /// </summary>
    /// <returns>Collection of allowed extensions</returns>
    IEnumerable<string> GetAllowedImageExtensions();

    /// <summary>
    /// Gets maximum allowed file size in bytes
    /// </summary>
    /// <returns>Maximum file size</returns>
    long GetMaxFileSize();

    #endregion

    #region Business Operations

    /// <summary>
    /// Sets an image as main/featured for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="bildId">Bild ID to set as main</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> SetAsMainImageAsync(int veranstaltungId, int bildId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets image count for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="activeOnly">Whether to count only active images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of images</returns>
    Task<int> GetImageCountAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total file size for a veranstaltung's images
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="activeOnly">Whether to count only active images</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total file size in bytes</returns>
    Task<long> GetTotalFileSizeAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a veranstaltung has images
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if the veranstaltung has images</returns>
    Task<bool> HasImagesAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Activates an image
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivates an image
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if operation was successful</returns>
    Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default);

    #endregion

    #region Statistics

    /// <summary>
    /// Gets image statistics for a veranstaltung
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Image statistics</returns>
    Task<object> GetImageStatisticsAsync(int veranstaltungId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets overall image statistics
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Overall image statistics</returns>
    Task<object> GetOverallImageStatisticsAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paged veranstaltung bilder
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="includeDeleted">Whether to include soft-deleted bilder</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paged result of veranstaltung bilder</returns>
    Task<PagedResult<VeranstaltungBildDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default);

    #endregion
}
