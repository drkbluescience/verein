using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Veranstaltung;

/// <summary>
/// Data Transfer Object for Veranstaltung entity
/// </summary>
public class VeranstaltungDto
{
    /// <summary>
    /// Event identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Event title
    /// </summary>
    [JsonPropertyName("titel")]
    public string Titel { get; set; } = string.Empty;

    /// <summary>
    /// Event description
    /// </summary>
    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Event start date and time
    /// </summary>
    [JsonPropertyName("startdatum")]
    public DateTime Startdatum { get; set; }

    /// <summary>
    /// Event end date and time
    /// </summary>
    [JsonPropertyName("enddatum")]
    public DateTime? Enddatum { get; set; }

    /// <summary>
    /// Event price
    /// </summary>
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
    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    /// <summary>
    /// Only for members flag
    /// </summary>
    [JsonPropertyName("nurFuerMitglieder")]
    public bool NurFuerMitglieder { get; set; }

    /// <summary>
    /// Maximum participants
    /// </summary>
    [JsonPropertyName("maxTeilnehmer")]
    public int? MaxTeilnehmer { get; set; }

    /// <summary>
    /// Registration required flag
    /// </summary>
    [JsonPropertyName("anmeldeErforderlich")]
    public bool AnmeldeErforderlich { get; set; }

    /// <summary>
    /// Is the event currently active
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
