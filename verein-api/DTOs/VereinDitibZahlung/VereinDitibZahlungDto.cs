using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VereinDitibZahlung;

/// <summary>
/// Data Transfer Object for VereinDitibZahlung
/// </summary>
public class VereinDitibZahlungDto
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Payment amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int WaehrungId { get; set; }

    /// <summary>
    /// Payment date
    /// </summary>
    [JsonPropertyName("zahlungsdatum")]
    public DateTime Zahlungsdatum { get; set; }

    /// <summary>
    /// Payment period (e.g., "2024-11")
    /// </summary>
    [JsonPropertyName("zahlungsperiode")]
    public string Zahlungsperiode { get; set; } = string.Empty;

    /// <summary>
    /// Payment method
    /// </summary>
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Bank account identifier
    /// </summary>
    [JsonPropertyName("bankkontoId")]
    public int? BankkontoId { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Notes/Remarks
    /// </summary>
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }

    /// <summary>
    /// Bank transaction identifier
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user identifier
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification timestamp
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user identifier
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }

    /// <summary>
    /// Active status
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}

