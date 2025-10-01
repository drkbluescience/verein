using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedAdresse;

/// <summary>
/// Data Transfer Object for MitgliedAdresse entity
/// </summary>
public class MitgliedAdresseDto
{
    /// <summary>
    /// MitgliedAdresse identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Mitglied identifier
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Address type identifier
    /// </summary>
    [JsonPropertyName("adresseTypId")]
    public int AdresseTypId { get; set; }

    /// <summary>
    /// Street name
    /// </summary>
    [JsonPropertyName("strasse")]
    public string? Strasse { get; set; }

    /// <summary>
    /// House number
    /// </summary>
    [JsonPropertyName("hausnummer")]
    public string? Hausnummer { get; set; }

    /// <summary>
    /// Additional address information
    /// </summary>
    [JsonPropertyName("adresszusatz")]
    public string? Adresszusatz { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    [JsonPropertyName("plz")]
    public string? PLZ { get; set; }

    /// <summary>
    /// City name
    /// </summary>
    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    /// <summary>
    /// District or neighborhood
    /// </summary>
    [JsonPropertyName("stadtteil")]
    public string? Stadtteil { get; set; }

    /// <summary>
    /// State or federal state
    /// </summary>
    [JsonPropertyName("bundesland")]
    public string? Bundesland { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    [JsonPropertyName("land")]
    public string? Land { get; set; }

    /// <summary>
    /// Post office box
    /// </summary>
    [JsonPropertyName("postfach")]
    public string? Postfach { get; set; }

    /// <summary>
    /// Phone number for this address
    /// </summary>
    [JsonPropertyName("telefonnummer")]
    public string? Telefonnummer { get; set; }

    /// <summary>
    /// Email address for this address
    /// </summary>
    [JsonPropertyName("email")]
    public string? EMail { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [JsonPropertyName("hinweis")]
    public string? Hinweis { get; set; }

    /// <summary>
    /// GPS latitude coordinate
    /// </summary>
    [JsonPropertyName("latitude")]
    public float? Latitude { get; set; }

    /// <summary>
    /// GPS longitude coordinate
    /// </summary>
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

    /// <summary>
    /// Creation date
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification date
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }
}
