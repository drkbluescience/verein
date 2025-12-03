using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// Data Transfer Object for BriefVorlage entity (Letter Template)
/// </summary>
public class BriefVorlageDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    [JsonPropertyName("betreff")]
    public string Betreff { get; set; } = string.Empty;

    [JsonPropertyName("inhalt")]
    public string Inhalt { get; set; } = string.Empty;

    [JsonPropertyName("kategorie")]
    public string? Kategorie { get; set; }

    [JsonPropertyName("logoPosition")]
    public string LogoPosition { get; set; } = "top";

    [JsonPropertyName("schriftart")]
    public string Schriftart { get; set; } = "Arial";

    [JsonPropertyName("schriftgroesse")]
    public int Schriftgroesse { get; set; } = 14;

    [JsonPropertyName("istSystemvorlage")]
    public bool IstSystemvorlage { get; set; }

    [JsonPropertyName("istAktiv")]
    public bool IstAktiv { get; set; }

    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }
}

