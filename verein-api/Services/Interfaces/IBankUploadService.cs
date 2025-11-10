using VereinsApi.DTOs.Finanz;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service for processing bank transaction uploads
/// </summary>
public interface IBankUploadService
{
    /// <summary>
    /// Process uploaded bank transaction Excel file
    /// </summary>
    /// <param name="request">Upload request containing file and metadata</param>
    /// <returns>Upload response with processing results</returns>
    Task<BankUploadResponseDto> ProcessBankUploadAsync(BankUploadRequestDto request);
}

