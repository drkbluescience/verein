using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Bankkonto;

/// <summary>
/// Data Transfer Object for updating an existing Bankkonto
/// </summary>
public class UpdateBankkontoDto
{
    [Required]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("kontotypId")]
    public int? KontotypId { get; set; }

    [Required]
    [MaxLength(34)]
    [JsonPropertyName("iban")]
    public string IBAN { get; set; } = string.Empty;

    [MaxLength(20)]
    [JsonPropertyName("bic")]
    public string? BIC { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("kontoinhaber")]
    public string? Kontoinhaber { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("bankname")]
    public string? Bankname { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("kontoNr")]
    public string? KontoNr { get; set; }

    [MaxLength(15)]
    [JsonPropertyName("blz")]
    public string? BLZ { get; set; }

    [MaxLength(250)]
    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    [JsonPropertyName("gueltigVon")]
    public DateTime? GueltigVon { get; set; }

    [JsonPropertyName("gueltigBis")]
    public DateTime? GueltigBis { get; set; }

    [JsonPropertyName("istStandard")]
    public bool? IstStandard { get; set; }

    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}
