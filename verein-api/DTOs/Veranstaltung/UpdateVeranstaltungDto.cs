using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Veranstaltung;

/// <summary>
/// Data Transfer Object for updating an existing Veranstaltung
/// </summary>
public class UpdateVeranstaltungDto
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int? VereinId { get; set; }

    /// <summary>
    /// Event title
    /// </summary>
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    [JsonPropertyName("titel")]
    public string? Titel { get; set; }

    /// <summary>
    /// Event description
    /// </summary>
    [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Event start date and time
    /// </summary>
    [JsonPropertyName("startdatum")]
    public DateTime? Startdatum { get; set; }

    /// <summary>
    /// Event end date and time
    /// </summary>
    [JsonPropertyName("enddatum")]
    public DateTime? Enddatum { get; set; }

    /// <summary>
    /// Event price
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative")]
    [JsonPropertyName("preis")]
    public decimal? Preis { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Event location
    /// </summary>
    [MaxLength(250, ErrorMessage = "Location cannot exceed 250 characters")]
    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    /// <summary>
    /// Only for members flag
    /// </summary>
    [JsonPropertyName("nurFuerMitglieder")]
    public bool? NurFuerMitglieder { get; set; }

    /// <summary>
    /// Maximum participants
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Maximum participants must be at least 1")]
    [JsonPropertyName("maxTeilnehmer")]
    public int? MaxTeilnehmer { get; set; }

    /// <summary>
    /// Registration required flag
    /// </summary>
    [JsonPropertyName("anmeldeErforderlich")]
    public bool? AnmeldeErforderlich { get; set; }

    /// <summary>
    /// Active status
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}