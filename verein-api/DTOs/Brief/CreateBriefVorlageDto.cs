using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// Data Transfer Object for creating a new BriefVorlage (Letter Template)
/// </summary>
public class CreateBriefVorlageDto
{
    [Required(ErrorMessage = "VereinId is required")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [Required(ErrorMessage = "Name is required")]
    [StringLength(150, ErrorMessage = "Name cannot exceed 150 characters")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Beschreibung cannot exceed 500 characters")]
    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    [Required(ErrorMessage = "Betreff is required")]
    [StringLength(200, ErrorMessage = "Betreff cannot exceed 200 characters")]
    [JsonPropertyName("betreff")]
    public string Betreff { get; set; } = string.Empty;

    [Required(ErrorMessage = "Inhalt is required")]
    [JsonPropertyName("inhalt")]
    public string Inhalt { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "Kategorie cannot exceed 50 characters")]
    [JsonPropertyName("kategorie")]
    public string? Kategorie { get; set; }

    [StringLength(20, ErrorMessage = "LogoPosition cannot exceed 20 characters")]
    [JsonPropertyName("logoPosition")]
    public string LogoPosition { get; set; } = "top";

    [StringLength(50, ErrorMessage = "Schriftart cannot exceed 50 characters")]
    [JsonPropertyName("schriftart")]
    public string Schriftart { get; set; } = "Arial";

    [Range(8, 72, ErrorMessage = "Schriftgroesse must be between 8 and 72")]
    [JsonPropertyName("schriftgroesse")]
    public int Schriftgroesse { get; set; } = 14;

    [JsonPropertyName("istAktiv")]
    public bool IstAktiv { get; set; } = true;
}

