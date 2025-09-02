using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungAnmeldung;

/// <summary>
/// Data Transfer Object for updating an existing VeranstaltungAnmeldung
/// </summary>
public class UpdateVeranstaltungAnmeldungDto
{
    /// <summary>
    /// Member identifier (if registered member)
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Participant name
    /// </summary>
    [StringLength(100, ErrorMessage = "Participant name cannot exceed 100 characters")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Participant email
    /// </summary>
    [EmailAddress(ErrorMessage = "Please enter a valid email address")]
    [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Participant phone
    /// </summary>
    [Phone(ErrorMessage = "Please enter a valid phone number")]
    [StringLength(30, ErrorMessage = "Phone number cannot exceed 30 characters")]
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Registration status (Registered, Confirmed, Cancelled, Waitlist)
    /// </summary>
    [StringLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
    [JsonPropertyName("status")]
    public string? Status { get; set; }

    /// <summary>
    /// Additional notes for the registration
    /// </summary>
    [StringLength(250, ErrorMessage = "Notes cannot exceed 250 characters")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Price paid for this registration
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
    /// Payment status identifier
    /// </summary>
    [JsonPropertyName("zahlungStatusId")]
    public int? ZahlungStatusId { get; set; }
}
