using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VereinsApi.DTOs.Bankkonto;

namespace VereinsApi.DTOs.MitgliedZahlung;

/// <summary>
/// Data Transfer Object for MitgliedZahlung entity
/// </summary>
public class MitgliedZahlungDto
{
    /// <summary>
    /// Zahlung identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Mitglied identifier
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Forderung identifier (optional)
    /// </summary>
    [JsonPropertyName("forderungId")]
    public int? ForderungId { get; set; }

    /// <summary>
    /// Payment type identifier
    /// </summary>
    [JsonPropertyName("zahlungTypId")]
    public int ZahlungTypId { get; set; }

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
    /// Payment method
    /// </summary>
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Bank account identifier (optional)
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
    /// Bank transaction identifier (optional)
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }

    /// <summary>
    /// Created timestamp
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Modified timestamp
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Bank account information (optional)
    /// </summary>
    [JsonPropertyName("bankkonto")]
    public BankkontoDto? Bankkonto { get; set; }
}

