using VereinsApi.DTOs.Finanz;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service for processing DITIB payment Excel uploads
/// </summary>
public interface IDitibUploadService
{
    /// <summary>
    /// Process uploaded DITIB payment Excel file
    /// </summary>
    /// <param name="request">Upload request containing file and metadata</param>
    /// <returns>Upload response with processing results</returns>
    Task<DitibUploadResponseDto> ProcessDitibUploadAsync(DitibUploadRequestDto request);
}

