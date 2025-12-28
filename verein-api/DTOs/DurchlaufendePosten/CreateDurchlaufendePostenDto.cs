using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.DurchlaufendePosten;

/// <summary>
/// Data Transfer Object for creating a new DurchlaufendePosten
/// </summary>
public class CreateDurchlaufendePostenDto
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Account number reference (9091, 9092, etc.)
    /// </summary>
    [Required(ErrorMessage = "FiBuNummer ist erforderlich")]
    [MaxLength(10, ErrorMessage = "FiBuNummer darf maximal 10 Zeichen lang sein")]
    [JsonPropertyName("fiBuNummer")]
    public string FiBuNummer { get; set; } = string.Empty;

    /// <summary>
    /// Description
    /// </summary>
    [Required(ErrorMessage = "Bezeichnung ist erforderlich")]
    [MaxLength(200, ErrorMessage = "Bezeichnung darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("bezeichnung")]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Date of incoming amount
    /// </summary>
    [Required(ErrorMessage = "EinnahmenDatum ist erforderlich")]
    [JsonPropertyName("einnahmenDatum")]
    public DateTime EinnahmenDatum { get; set; }

    /// <summary>
    /// Incoming amount
    /// </summary>
    [Required(ErrorMessage = "EinnahmenBetrag ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "EinnahmenBetrag muss positiv sein")]
    [JsonPropertyName("einnahmenBetrag")]
    public decimal EinnahmenBetrag { get; set; }

    /// <summary>
    /// Recipient organization
    /// </summary>
    [MaxLength(200, ErrorMessage = "Empfaenger darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

