using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.DurchlaufendePosten;

/// <summary>
/// Data Transfer Object for updating an existing DurchlaufendePosten
/// </summary>
public class UpdateDurchlaufendePostenDto
{
    /// <summary>
    /// Entry identifier
    /// </summary>
    [Required(ErrorMessage = "Id ist erforderlich")]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Description
    /// </summary>
    [Required(ErrorMessage = "Bezeichnung ist erforderlich")]
    [MaxLength(200, ErrorMessage = "Bezeichnung darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("bezeichnung")]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Date of outgoing transfer
    /// </summary>
    [JsonPropertyName("ausgabenDatum")]
    public DateTime? AusgabenDatum { get; set; }

    /// <summary>
    /// Outgoing amount
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "AusgabenBetrag muss positiv sein")]
    [JsonPropertyName("ausgabenBetrag")]
    public decimal? AusgabenBetrag { get; set; }

    /// <summary>
    /// Recipient organization
    /// </summary>
    [MaxLength(200, ErrorMessage = "Empfaenger darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Transfer reference
    /// </summary>
    [MaxLength(100, ErrorMessage = "Referenz darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status: OFFEN, TEILWEISE, ABGESCHLOSSEN
    /// </summary>
    [MaxLength(20, ErrorMessage = "Status darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("status")]
    public string? Status { get; set; }

    /// <summary>
    /// Link to outgoing Kassenbuch entry
    /// </summary>
    [JsonPropertyName("kassenbuchAusgabeId")]
    public int? KassenbuchAusgabeId { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

