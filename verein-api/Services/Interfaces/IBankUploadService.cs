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

    /// <summary>
    /// Get unmatched BankBuchungen (transactions without member match)
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of unmatched bank transactions</returns>
    Task<IEnumerable<UnmatchedBankBuchungDto>> GetUnmatchedBankBuchungenAsync(int? vereinId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Manually match a BankBuchung to a member
    /// </summary>
    /// <param name="request">Manual match request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Manual match response</returns>
    Task<ManualMatchResponseDto> ManualMatchBankBuchungAsync(ManualMatchRequestDto request, CancellationToken cancellationToken = default);
}

