using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Finanz;

/// <summary>
/// Request DTO for manually matching a BankBuchung to a member
/// </summary>
public class ManualMatchRequestDto
{
    /// <summary>
    /// BankBuchung ID to match
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int BankBuchungId { get; set; }

    /// <summary>
    /// Member ID to match to
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Optional: Specific Forderung IDs to allocate payment to
    /// If empty, will auto-match to open Forderungen
    /// </summary>
    [JsonPropertyName("forderungIds")]
    public List<int> ForderungIds { get; set; } = new();

    /// <summary>
    /// Optional: Specific allocation amounts for each Forderung
    /// Must match ForderungIds length if provided
    /// </summary>
    [JsonPropertyName("allocationAmounts")]
    public List<decimal> AllocationAmounts { get; set; } = new();
}

/// <summary>
/// Response DTO for manual matching operation
/// </summary>
public class ManualMatchResponseDto
{
    /// <summary>
    /// Indicates if the matching was successful
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    /// <summary>
    /// Message describing the result
    /// </summary>
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Created MitgliedZahlung ID
    /// </summary>
    [JsonPropertyName("mitgliedZahlungId")]
    public int? MitgliedZahlungId { get; set; }

    /// <summary>
    /// Number of Forderungen matched
    /// </summary>
    [JsonPropertyName("matchedForderungenCount")]
    public int MatchedForderungenCount { get; set; }

    /// <summary>
    /// Total amount allocated to Forderungen
    /// </summary>
    [JsonPropertyName("allocatedAmount")]
    public decimal AllocatedAmount { get; set; }

    /// <summary>
    /// Remaining amount (if any)
    /// </summary>
    [JsonPropertyName("remainingAmount")]
    public decimal RemainingAmount { get; set; }

    /// <summary>
    /// List of matched Forderung IDs
    /// </summary>
    [JsonPropertyName("matchedForderungIds")]
    public List<int> MatchedForderungIds { get; set; } = new();
}

/// <summary>
/// DTO for unmatched BankBuchung
/// </summary>
public class UnmatchedBankBuchungDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("vereinName")]
    public string? VereinName { get; set; }

    [JsonPropertyName("buchungsdatum")]
    public DateTime Buchungsdatum { get; set; }

    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    [JsonPropertyName("verwendungszweck")]
    public string? Verwendungszweck { get; set; }

    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    [JsonPropertyName("bankKontoId")]
    public int BankKontoId { get; set; }

    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }
}

