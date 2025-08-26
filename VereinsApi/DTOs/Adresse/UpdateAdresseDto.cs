using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Adresse;

/// <summary>
/// Data Transfer Object for updating an existing Adresse
/// </summary>
public class UpdateAdresseDto
{
    [JsonPropertyName("vereinId")]
    public int? VereinId { get; set; }

    [JsonPropertyName("adresseTypId")]
    public int? AdresseTypId { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("strasse")]
    public string? Strasse { get; set; }

    [MaxLength(10)]
    [JsonPropertyName("hausnummer")]
    public string? Hausnummer { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("adresszusatz")]
    public string? Adresszusatz { get; set; }

    [MaxLength(10)]
    [JsonPropertyName("plz")]
    public string? PLZ { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    [MaxLength(50)]
    [JsonPropertyName("stadtteil")]
    public string? Stadtteil { get; set; }

    [MaxLength(50)]
    [JsonPropertyName("bundesland")]
    public string? Bundesland { get; set; }

    [MaxLength(50)]
    [JsonPropertyName("land")]
    public string? Land { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("postfach")]
    public string? Postfach { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("telefonnummer")]
    public string? Telefonnummer { get; set; }

    [MaxLength(30)]
    [JsonPropertyName("faxnummer")]
    public string? Faxnummer { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    [JsonPropertyName("email")]
    public string? EMail { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("kontaktperson")]
    public string? Kontaktperson { get; set; }

    [MaxLength(250)]
    [JsonPropertyName("hinweis")]
    public string? Hinweis { get; set; }

    [JsonPropertyName("latitude")]
    public double? Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double? Longitude { get; set; }

    [JsonPropertyName("gueltigVon")]
    public DateTime? GueltigVon { get; set; }

    [JsonPropertyName("gueltigBis")]
    public DateTime? GueltigBis { get; set; }

    [JsonPropertyName("istStandard")]
    public bool? IstStandard { get; set; }

    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}
