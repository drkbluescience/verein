using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Adresse;

/// <summary>
/// Data Transfer Object for Adresse entity
/// </summary>
public class AdresseDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int? VereinId { get; set; }

    [JsonPropertyName("adresseTypId")]
    public int? AdresseTypId { get; set; }

    [JsonPropertyName("strasse")]
    public string? Strasse { get; set; }

    [JsonPropertyName("hausnummer")]
    public string? Hausnummer { get; set; }

    [JsonPropertyName("adresszusatz")]
    public string? Adresszusatz { get; set; }

    [JsonPropertyName("plz")]
    public string? PLZ { get; set; }

    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    [JsonPropertyName("stadtteil")]
    public string? Stadtteil { get; set; }

    [JsonPropertyName("bundesland")]
    public string? Bundesland { get; set; }

    [JsonPropertyName("land")]
    public string? Land { get; set; }

    [JsonPropertyName("postfach")]
    public string? Postfach { get; set; }

    [JsonPropertyName("telefonnummer")]
    public string? Telefonnummer { get; set; }

    [JsonPropertyName("faxnummer")]
    public string? Faxnummer { get; set; }

    [JsonPropertyName("email")]
    public string? EMail { get; set; }

    [JsonPropertyName("kontaktperson")]
    public string? Kontaktperson { get; set; }

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
