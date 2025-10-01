using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedAdresse;

/// <summary>
/// Data Transfer Object for updating an existing MitgliedAdresse
/// </summary>
public class UpdateMitgliedAdresseDto
{
    /// <summary>
    /// MitgliedAdresse identifier
    /// </summary>
    [Required(ErrorMessage = "Id ist erforderlich")]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Mitglied identifier
    /// </summary>
    [Required(ErrorMessage = "MitgliedId ist erforderlich")]
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Address type identifier
    /// </summary>
    [Required(ErrorMessage = "AdresseTypId ist erforderlich")]
    [JsonPropertyName("adresseTypId")]
    public int AdresseTypId { get; set; }

    /// <summary>
    /// Street name
    /// </summary>
    [MaxLength(100, ErrorMessage = "Strasse darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("strasse")]
    public string? Strasse { get; set; }

    /// <summary>
    /// House number
    /// </summary>
    [MaxLength(10, ErrorMessage = "Hausnummer darf maximal 10 Zeichen lang sein")]
    [JsonPropertyName("hausnummer")]
    public string? Hausnummer { get; set; }

    /// <summary>
    /// Additional address information
    /// </summary>
    [MaxLength(100, ErrorMessage = "Adresszusatz darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("adresszusatz")]
    public string? Adresszusatz { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    [MaxLength(10, ErrorMessage = "PLZ darf maximal 10 Zeichen lang sein")]
    [JsonPropertyName("plz")]
    public string? PLZ { get; set; }

    /// <summary>
    /// City name
    /// </summary>
    [MaxLength(100, ErrorMessage = "Ort darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    /// <summary>
    /// District or neighborhood
    /// </summary>
    [MaxLength(50, ErrorMessage = "Stadtteil darf maximal 50 Zeichen lang sein")]
    [JsonPropertyName("stadtteil")]
    public string? Stadtteil { get; set; }

    /// <summary>
    /// State or federal state
    /// </summary>
    [MaxLength(50, ErrorMessage = "Bundesland darf maximal 50 Zeichen lang sein")]
    [JsonPropertyName("bundesland")]
    public string? Bundesland { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    [MaxLength(50, ErrorMessage = "Land darf maximal 50 Zeichen lang sein")]
    [JsonPropertyName("land")]
    public string? Land { get; set; }

    /// <summary>
    /// Post office box
    /// </summary>
    [MaxLength(30, ErrorMessage = "Postfach darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("postfach")]
    public string? Postfach { get; set; }

    /// <summary>
    /// Phone number for this address
    /// </summary>
    [MaxLength(30, ErrorMessage = "Telefonnummer darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("telefonnummer")]
    public string? Telefonnummer { get; set; }

    /// <summary>
    /// Email address for this address
    /// </summary>
    [EmailAddress(ErrorMessage = "Ungültige E-Mail-Adresse")]
    [MaxLength(100, ErrorMessage = "E-Mail darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("email")]
    public string? EMail { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(250, ErrorMessage = "Hinweis darf maximal 250 Zeichen lang sein")]
    [JsonPropertyName("hinweis")]
    public string? Hinweis { get; set; }

    /// <summary>
    /// GPS latitude coordinate
    /// </summary>
    [Range(-90.0, 90.0, ErrorMessage = "Latitude muss zwischen -90 und 90 liegen")]
    [JsonPropertyName("latitude")]
    public float? Latitude { get; set; }

    /// <summary>
    /// GPS longitude coordinate
    /// </summary>
    [Range(-180.0, 180.0, ErrorMessage = "Longitude muss zwischen -180 und 180 liegen")]
    [JsonPropertyName("longitude")]
    public float? Longitude { get; set; }

    /// <summary>
    /// Valid from date
    /// </summary>
    [JsonPropertyName("gueltigVon")]
    public DateTime? GueltigVon { get; set; }

    /// <summary>
    /// Valid until date
    /// </summary>
    [JsonPropertyName("gueltigBis")]
    public DateTime? GueltigBis { get; set; }

    /// <summary>
    /// Is this the default address
    /// </summary>
    [JsonPropertyName("istStandard")]
    public bool? IstStandard { get; set; }

    /// <summary>
    /// Is the address currently active
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}
