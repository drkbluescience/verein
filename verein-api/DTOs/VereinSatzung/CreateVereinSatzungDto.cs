using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VereinSatzung;

/// <summary>
/// DTO for creating a new VereinSatzung
/// </summary>
public class CreateVereinSatzungDto
{
    [Required]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [Required]
    [MaxLength(500)]
    [JsonPropertyName("dosyaPfad")]
    public string DosyaPfad { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("satzungVom")]
    public DateTime SatzungVom { get; set; }

    [JsonPropertyName("aktif")]
    public bool Aktif { get; set; } = true;

    [MaxLength(500)]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    [MaxLength(200)]
    [JsonPropertyName("dosyaAdi")]
    public string? DosyaAdi { get; set; }

    [JsonPropertyName("dosyaBoyutu")]
    public long? DosyaBoyutu { get; set; }
}

