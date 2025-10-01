using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungAnmeldung;

/// <summary>
/// Data Transfer Object for VeranstaltungAnmeldung entity
/// </summary>
public class VeranstaltungAnmeldungDto
{
    /// <summary>
    /// Registration identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Event identifier
    /// </summary>
    [JsonPropertyName("veranstaltungId")]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Member identifier (if registered member)
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Participant name
    /// </summary>
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Participant email
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Participant phone
    /// </summary>
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Registration status (Pending, Confirmed, Cancelled, Waitlist)
    /// </summary>
    [JsonPropertyName("status")]
    public string? Status { get; set; }

    /// <summary>
    /// Additional notes for the registration
    /// </summary>
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Price paid for this registration
    /// </summary>
    [JsonPropertyName("preis")]
    public decimal? Preis { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Payment status identifier
    /// </summary>
    [JsonPropertyName("zahlungStatusId")]
    public int? ZahlungStatusId { get; set; }

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
