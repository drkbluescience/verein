using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungZahlung;

/// <summary>
/// Data Transfer Object for VeranstaltungZahlung entity
/// </summary>
public class VeranstaltungZahlungDto
{
    /// <summary>
    /// Zahlung identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Veranstaltung identifier
    /// </summary>
    [JsonPropertyName("veranstaltungId")]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Anmeldung identifier
    /// </summary>
    [JsonPropertyName("anmeldungId")]
    public int AnmeldungId { get; set; }

    /// <summary>
    /// Name of the person making the payment
    /// </summary>
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Email of the person making the payment
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Payment amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int WaehrungId { get; set; }

    /// <summary>
    /// Payment date
    /// </summary>
    [JsonPropertyName("zahlungsdatum")]
    public DateTime Zahlungsdatum { get; set; }

    /// <summary>
    /// Payment method
    /// </summary>
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }

    /// <summary>
    /// Created timestamp
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Modified timestamp
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }
}

