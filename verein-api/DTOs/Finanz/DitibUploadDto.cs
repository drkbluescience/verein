using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Finanz;

/// <summary>
/// Request DTO for uploading DITIB payment Excel file
/// </summary>
public class DitibUploadRequestDto
{
    /// <summary>
    /// Verein ID for which the DITIB payments are being uploaded
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Bank account ID for the payments
    /// </summary>
    [JsonPropertyName("bankKontoId")]
    public int BankKontoId { get; set; }

    /// <summary>
    /// Excel file (sent as multipart/form-data)
    /// </summary>
    [JsonIgnore]
    public IFormFile? File { get; set; }
}

/// <summary>
/// Response DTO for DITIB upload operation
/// </summary>
public class DitibUploadResponseDto
{
    /// <summary>
    /// Indicates if the upload was successful
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    /// <summary>
    /// Overall message
    /// </summary>
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Total number of rows processed
    /// </summary>
    [JsonPropertyName("totalRows")]
    public int TotalRows { get; set; }

    /// <summary>
    /// Number of successfully processed payments
    /// </summary>
    [JsonPropertyName("successCount")]
    public int SuccessCount { get; set; }

    /// <summary>
    /// Number of failed payments
    /// </summary>
    [JsonPropertyName("failedCount")]
    public int FailedCount { get; set; }

    /// <summary>
    /// Number of skipped payments (duplicates, etc.)
    /// </summary>
    [JsonPropertyName("skippedCount")]
    public int SkippedCount { get; set; }

    /// <summary>
    /// Detailed results for each payment
    /// </summary>
    [JsonPropertyName("details")]
    public List<DitibUploadDetailDto> Details { get; set; } = new();

    /// <summary>
    /// List of errors encountered
    /// </summary>
    [JsonPropertyName("errors")]
    public List<string> Errors { get; set; } = new();
}

/// <summary>
/// Detailed result for a single DITIB payment
/// </summary>
public class DitibUploadDetailDto
{
    /// <summary>
    /// Row number in Excel file
    /// </summary>
    [JsonPropertyName("rowNumber")]
    public int RowNumber { get; set; }

    /// <summary>
    /// Payment date
    /// </summary>
    [JsonPropertyName("zahlungsdatum")]
    public DateTime? Zahlungsdatum { get; set; }

    /// <summary>
    /// Payment amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal? Betrag { get; set; }

    /// <summary>
    /// Payment period (YYYY-MM format)
    /// </summary>
    [JsonPropertyName("zahlungsperiode")]
    public string? Zahlungsperiode { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Processing status
    /// </summary>
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty; // "Success", "Failed", "Skipped"

    /// <summary>
    /// Status message
    /// </summary>
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Created BankBuchung ID (if successful)
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }

    /// <summary>
    /// Created VereinDitibZahlung ID (if successful)
    /// </summary>
    [JsonPropertyName("vereinDitibZahlungId")]
    public int? VereinDitibZahlungId { get; set; }
}

