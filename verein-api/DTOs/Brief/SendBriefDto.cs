using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// Data Transfer Object for sending a Brief to one or more Mitglieder
/// </summary>
public class SendBriefDto
{
    [Required(ErrorMessage = "BriefId is required")]
    [JsonPropertyName("briefId")]
    public int BriefId { get; set; }

    [Required(ErrorMessage = "At least one MitgliedId is required")]
    [MinLength(1, ErrorMessage = "At least one MitgliedId is required")]
    [JsonPropertyName("mitgliedIds")]
    public List<int> MitgliedIds { get; set; } = new();
}

/// <summary>
/// Data Transfer Object for quick send (create and send in one step)
/// </summary>
public class QuickSendBriefDto
{
    [Required(ErrorMessage = "VereinId is required")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("vorlageId")]
    public int? VorlageId { get; set; }

    [Required(ErrorMessage = "Titel is required")]
    [StringLength(200, ErrorMessage = "Titel cannot exceed 200 characters")]
    [JsonPropertyName("titel")]
    public string Titel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Betreff is required")]
    [StringLength(200, ErrorMessage = "Betreff cannot exceed 200 characters")]
    [JsonPropertyName("betreff")]
    public string Betreff { get; set; } = string.Empty;

    [Required(ErrorMessage = "Inhalt is required")]
    [JsonPropertyName("inhalt")]
    public string Inhalt { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "LogoUrl cannot exceed 500 characters")]
    [JsonPropertyName("logoUrl")]
    public string? LogoUrl { get; set; }

    [StringLength(20, ErrorMessage = "LogoPosition cannot exceed 20 characters")]
    [JsonPropertyName("logoPosition")]
    public string LogoPosition { get; set; } = "top";

    [StringLength(50, ErrorMessage = "Schriftart cannot exceed 50 characters")]
    [JsonPropertyName("schriftart")]
    public string Schriftart { get; set; } = "Arial";

    [Range(8, 72, ErrorMessage = "Schriftgroesse must be between 8 and 72")]
    [JsonPropertyName("schriftgroesse")]
    public int Schriftgroesse { get; set; } = 14;

    [Required(ErrorMessage = "At least one MitgliedId is required")]
    [MinLength(1, ErrorMessage = "At least one MitgliedId is required")]
    [JsonPropertyName("mitgliedIds")]
    public List<int> MitgliedIds { get; set; } = new();
}

