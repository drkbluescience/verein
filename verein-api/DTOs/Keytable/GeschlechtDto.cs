using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Keytable;

/// <summary>
/// Data Transfer Object for Geschlecht (Gender) lookup table
/// </summary>
public class GeschlechtDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<GeschlechtUebersetzungDto> Uebersetzungen { get; set; } = new List<GeschlechtUebersetzungDto>();
}

/// <summary>
/// Translation DTO for Geschlecht
/// </summary>
public class GeschlechtUebersetzungDto
{
    [JsonPropertyName("sprache")]
    public string Sprache { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

