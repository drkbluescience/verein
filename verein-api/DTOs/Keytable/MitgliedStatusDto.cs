using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Keytable;

public class MitgliedStatusDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("uebersetzungen")]
    public IEnumerable<MitgliedStatusUebersetzungDto> Uebersetzungen { get; set; } = new List<MitgliedStatusUebersetzungDto>();
}

public class MitgliedStatusUebersetzungDto
{
    [JsonPropertyName("sprache")]
    public string Sprache { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

