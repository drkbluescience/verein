using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VereinSatzung;

/// <summary>
/// DTO for updating an existing VereinSatzung
/// </summary>
public class UpdateVereinSatzungDto
{
    [JsonPropertyName("satzungVom")]
    public DateTime? SatzungVom { get; set; }

    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }

    [MaxLength(500)]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

