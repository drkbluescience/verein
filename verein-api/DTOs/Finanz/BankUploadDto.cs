using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace VereinsApi.DTOs.Finanz;

/// <summary>
/// Request DTO for uploading bank transaction Excel file
/// </summary>
public class BankUploadRequestDto
{
    /// <summary>
    /// Verein ID for which the transactions are being uploaded
    /// </summary>
    [JsonPropertyName("vereinId")]
    [FromForm(Name = "vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Bank account ID for the transactions
    /// </summary>
    [JsonPropertyName("bankKontoId")]
    [FromForm(Name = "bankKontoId")]
    public int BankKontoId { get; set; }

    /// <summary>
    /// Excel file (sent as multipart/form-data)
    /// </summary>
    [FromForm(Name = "file")]
    public IFormFile? File { get; set; }
}

/// <summary>
/// Response DTO for bank upload operation
/// </summary>
public class BankUploadResponseDto
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
    /// Number of successfully processed transactions
    /// </summary>
    [JsonPropertyName("successCount")]
    public int SuccessCount { get; set; }

    /// <summary>
    /// Number of failed transactions
    /// </summary>
    [JsonPropertyName("failedCount")]
    public int FailedCount { get; set; }

    /// <summary>
    /// Number of skipped transactions (duplicates, etc.)
    /// </summary>
    [JsonPropertyName("skippedCount")]
    public int SkippedCount { get; set; }

    /// <summary>
    /// Number of unmatched transactions (no member found)
    /// </summary>
    [JsonPropertyName("unmatchedCount")]
    public int UnmatchedCount { get; set; }

    /// <summary>
    /// Detailed results for each transaction
    /// </summary>
    [JsonPropertyName("details")]
    public List<BankUploadDetailDto> Details { get; set; } = new();

    /// <summary>
    /// List of unmatched transactions that need manual matching
    /// </summary>
    [JsonPropertyName("unmatchedTransactions")]
    public List<BankUploadDetailDto> UnmatchedTransactions { get; set; } = new();

    /// <summary>
    /// List of errors encountered
    /// </summary>
    [JsonPropertyName("errors")]
    public List<string> Errors { get; set; } = new();
}

/// <summary>
/// Detailed result for a single transaction
/// </summary>
public class BankUploadDetailDto
{
    /// <summary>
    /// Row number in Excel file
    /// </summary>
    [JsonPropertyName("rowNumber")]
    public int RowNumber { get; set; }

    /// <summary>
    /// Transaction date
    /// </summary>
    [JsonPropertyName("buchungsdatum")]
    public DateTime? Buchungsdatum { get; set; }

    /// <summary>
    /// Transaction amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal? Betrag { get; set; }

    /// <summary>
    /// Recipient/Sender name
    /// </summary>
    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Purpose of transaction
    /// </summary>
    [JsonPropertyName("verwendungszweck")]
    public string? Verwendungszweck { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Matched member ID (if found)
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Matched member name (if found)
    /// </summary>
    [JsonPropertyName("mitgliedName")]
    public string? MitgliedName { get; set; }

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
    /// Created MitgliedZahlung ID (if successful and member matched)
    /// </summary>
    [JsonPropertyName("mitgliedZahlungId")]
    public int? MitgliedZahlungId { get; set; }
}

/// <summary>
/// Parsed row from Excel file
/// </summary>
public class ExcelTransactionRow
{
    public int RowNumber { get; set; }
    public DateTime? Buchungsdatum { get; set; }
    public decimal? Betrag { get; set; }
    public string? Empfaenger { get; set; }
    public string? Verwendungszweck { get; set; }
    public string? Referenz { get; set; }
    public string? IBAN { get; set; }
}

