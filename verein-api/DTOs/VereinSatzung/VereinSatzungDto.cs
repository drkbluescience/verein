using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VereinSatzung;

/// <summary>
/// Data Transfer Object for VereinSatzung entity
/// </summary>
public class VereinSatzungDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("dosyaPfad")]
    public string DosyaPfad { get; set; } = string.Empty;

    [JsonPropertyName("satzungVom")]
    public DateTime SatzungVom { get; set; }

    [JsonPropertyName("aktif")]
    public bool Aktif { get; set; }

    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    [JsonPropertyName("dosyaAdi")]
    public string? DosyaAdi { get; set; }

    [JsonPropertyName("dosyaBoyutu")]
    public long? DosyaBoyutu { get; set; }

    // Audit fields
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }
}

