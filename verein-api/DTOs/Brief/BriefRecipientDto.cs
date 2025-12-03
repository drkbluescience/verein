using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Brief;

/// <summary>
/// DTO for brief recipient information
/// </summary>
public class BriefRecipientDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    [JsonPropertyName("vorname")]
    public string Vorname { get; set; } = string.Empty;

    [JsonPropertyName("nachname")]
    public string Nachname { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("istGelesen")]
    public bool IstGelesen { get; set; }

    [JsonPropertyName("gelesenDatum")]
    public DateTime? GelesenDatum { get; set; }

    [JsonPropertyName("gesendetDatum")]
    public DateTime GesendetDatum { get; set; }
}

