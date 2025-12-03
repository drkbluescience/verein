using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// Data Transfer Object for Nachricht entity (Sent Message)
/// </summary>
public class NachrichtDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("briefId")]
    public int BriefId { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    [JsonPropertyName("betreff")]
    public string Betreff { get; set; } = string.Empty;

    [JsonPropertyName("inhalt")]
    public string Inhalt { get; set; } = string.Empty;

    [JsonPropertyName("logoUrl")]
    public string? LogoUrl { get; set; }

    [JsonPropertyName("istGelesen")]
    public bool IstGelesen { get; set; }

    [JsonPropertyName("gelesenDatum")]
    public DateTime? GelesenDatum { get; set; }

    [JsonPropertyName("gesendetDatum")]
    public DateTime GesendetDatum { get; set; }

    // Navigation properties for display
    [JsonPropertyName("vereinName")]
    public string? VereinName { get; set; }

    [JsonPropertyName("absenderName")]
    public string? AbsenderName { get; set; }

    [JsonPropertyName("mitgliedVorname")]
    public string? MitgliedVorname { get; set; }

    [JsonPropertyName("mitgliedNachname")]
    public string? MitgliedNachname { get; set; }

    [JsonPropertyName("mitgliedEmail")]
    public string? MitgliedEmail { get; set; }

    [JsonPropertyName("briefTitel")]
    public string? BriefTitel { get; set; }
}

