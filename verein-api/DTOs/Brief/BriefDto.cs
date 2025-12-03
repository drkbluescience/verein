using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// Data Transfer Object for Brief entity (Letter Draft)
/// </summary>
public class BriefDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("vorlageId")]
    public int? VorlageId { get; set; }

    [JsonPropertyName("titel")]
    public string Titel { get; set; } = string.Empty;

    [JsonPropertyName("betreff")]
    public string Betreff { get; set; } = string.Empty;

    [JsonPropertyName("inhalt")]
    public string Inhalt { get; set; } = string.Empty;

    [JsonPropertyName("logoUrl")]
    public string? LogoUrl { get; set; }

    [JsonPropertyName("logoPosition")]
    public string LogoPosition { get; set; } = "top";

    [JsonPropertyName("schriftart")]
    public string Schriftart { get; set; } = "Arial";

    [JsonPropertyName("schriftgroesse")]
    public int Schriftgroesse { get; set; } = 14;

    [JsonPropertyName("status")]
    public string Status { get; set; } = "Entwurf";

    [JsonPropertyName("vorlageName")]
    public string? VorlageName { get; set; }

    [JsonPropertyName("nachrichtenCount")]
    public int NachrichtenCount { get; set; }

    /// <summary>
    /// Selected member IDs for draft (from JSON in database)
    /// </summary>
    [JsonPropertyName("selectedMitgliedIds")]
    public List<int>? SelectedMitgliedIds { get; set; }

    /// <summary>
    /// Count of selected members (for display in list)
    /// </summary>
    [JsonPropertyName("selectedMitgliedCount")]
    public int SelectedMitgliedCount => SelectedMitgliedIds?.Count ?? 0;

    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }
}

