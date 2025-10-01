using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Bankkonto;

/// <summary>
/// Data Transfer Object for Bankkonto entity
/// </summary>
public class BankkontoDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("kontotypId")]
    public int? KontotypId { get; set; }

    [JsonPropertyName("iban")]
    public string IBAN { get; set; } = string.Empty;

    [JsonPropertyName("bic")]
    public string? BIC { get; set; }

    [JsonPropertyName("kontoinhaber")]
    public string? Kontoinhaber { get; set; }

    [JsonPropertyName("bankname")]
    public string? Bankname { get; set; }

    [JsonPropertyName("kontoNr")]
    public string? KontoNr { get; set; }

    [JsonPropertyName("blz")]
    public string? BLZ { get; set; }

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
