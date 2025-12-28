using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.DurchlaufendePosten;

/// <summary>
/// Data Transfer Object for DurchlaufendePosten (Transit Items) entity
/// </summary>
public class DurchlaufendePostenDto
{
    /// <summary>
    /// Entry identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Association identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Account number reference (9091, 9092, etc.)
    /// </summary>
    [JsonPropertyName("fiBuNummer")]
    public string FiBuNummer { get; set; } = string.Empty;

    /// <summary>
    /// Description
    /// </summary>
    [JsonPropertyName("bezeichnung")]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Date of incoming amount
    /// </summary>
    [JsonPropertyName("einnahmenDatum")]
    public DateTime EinnahmenDatum { get; set; }

    /// <summary>
    /// Incoming amount
    /// </summary>
    [JsonPropertyName("einnahmenBetrag")]
    public decimal EinnahmenBetrag { get; set; }

    /// <summary>
    /// Date of outgoing transfer
    /// </summary>
    [JsonPropertyName("ausgabenDatum")]
    public DateTime? AusgabenDatum { get; set; }

    /// <summary>
    /// Outgoing amount
    /// </summary>
    [JsonPropertyName("ausgabenBetrag")]
    public decimal? AusgabenBetrag { get; set; }

    /// <summary>
    /// Recipient organization
    /// </summary>
    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Transfer reference
    /// </summary>
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status: OFFEN, TEILWEISE, ABGESCHLOSSEN
    /// </summary>
    [JsonPropertyName("status")]
    public string Status { get; set; } = "OFFEN";

    /// <summary>
    /// Link to incoming Kassenbuch entry
    /// </summary>
    [JsonPropertyName("kassenbuchEinnahmeId")]
    public int? KassenbuchEinnahmeId { get; set; }

    /// <summary>
    /// Link to outgoing Kassenbuch entry
    /// </summary>
    [JsonPropertyName("kassenbuchAusgabeId")]
    public int? KassenbuchAusgabeId { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Creation date
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Last modification date
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Account description (from FiBuKonto)
    /// </summary>
    [JsonPropertyName("fiBuKontoBezeichnung")]
    public string? FiBuKontoBezeichnung { get; set; }

    /// <summary>
    /// Outstanding balance (calculated)
    /// </summary>
    [JsonPropertyName("offenerBetrag")]
    public decimal OffenerBetrag => EinnahmenBetrag - (AusgabenBetrag ?? 0);
}

