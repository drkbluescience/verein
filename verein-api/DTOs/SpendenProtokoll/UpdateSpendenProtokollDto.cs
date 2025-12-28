using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.SpendenProtokoll;

/// <summary>
/// Data Transfer Object for updating an existing SpendenProtokoll
/// </summary>
public class UpdateSpendenProtokollDto
{
    /// <summary>
    /// Protocol identifier
    /// </summary>
    [Required(ErrorMessage = "Id ist erforderlich")]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Purpose of the donation
    /// </summary>
    [Required(ErrorMessage = "Zweck ist erforderlich")]
    [MaxLength(200, ErrorMessage = "Zweck darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("zweck")]
    public string Zweck { get; set; } = string.Empty;

    /// <summary>
    /// Purpose category
    /// </summary>
    [MaxLength(30, ErrorMessage = "ZweckKategorie darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("zweckKategorie")]
    public string? ZweckKategorie { get; set; }

    /// <summary>
    /// First witness signed
    /// </summary>
    [JsonPropertyName("zeuge1Unterschrift")]
    public bool Zeuge1Unterschrift { get; set; }

    /// <summary>
    /// Second witness signed
    /// </summary>
    [JsonPropertyName("zeuge2Unterschrift")]
    public bool Zeuge2Unterschrift { get; set; }

    /// <summary>
    /// Third witness signed
    /// </summary>
    [JsonPropertyName("zeuge3Unterschrift")]
    public bool Zeuge3Unterschrift { get; set; }

    /// <summary>
    /// Link to Kassenbuch entry
    /// </summary>
    [JsonPropertyName("kassenbuchId")]
    public int? KassenbuchId { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

