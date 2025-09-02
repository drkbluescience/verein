using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Adresse;

/// <summary>
/// Data Transfer Object for creating a new Adresse
/// </summary>
public class CreateAdresseDto
{
    [Required(ErrorMessage = "VereinId is required")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    [JsonPropertyName("adresseTypId")]
    public int? AdresseTypId { get; set; }

    [Required(ErrorMessage = "Strasse is required")]
    [MaxLength(100)]
    [JsonPropertyName("strasse")]
    public string Strasse { get; set; } = string.Empty;

    [MaxLength(10)]
    [JsonPropertyName("hausnummer")]
    public string? Hausnummer { get; set; }

    [MaxLength(100)]
    [JsonPropertyName("adresszusatz")]
    public string? Adresszusatz { get; set; }

    [Required(ErrorMessage = "PLZ is required")]
    [MaxLength(10)]
    [JsonPropertyName("plz")]
    public string PLZ { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ort is required")]
    [MaxLength(100)]
    [JsonPropertyName("ort")]
    public string Ort { get; set; } = string.Empty;

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

    [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
    [JsonPropertyName("latitude")]
    public double? Latitude { get; set; }

    [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
    [JsonPropertyName("longitude")]
    public double? Longitude { get; set; }

    [JsonPropertyName("gueltigVon")]
    public DateTime? GueltigVon { get; set; }

    [JsonPropertyName("gueltigBis")]
    public DateTime? GueltigBis { get; set; }

    [JsonPropertyName("istStandard")]
    public bool? IstStandard { get; set; }
}

