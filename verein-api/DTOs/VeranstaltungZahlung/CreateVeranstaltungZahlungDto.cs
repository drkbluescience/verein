using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungZahlung;

/// <summary>
/// Data Transfer Object for creating VeranstaltungZahlung
/// </summary>
public class CreateVeranstaltungZahlungDto
{
    /// <summary>
    /// Veranstaltung identifier
    /// </summary>
    [Required(ErrorMessage = "VeranstaltungId ist erforderlich")]
    [JsonPropertyName("veranstaltungId")]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Anmeldung identifier
    /// </summary>
    [Required(ErrorMessage = "AnmeldungId ist erforderlich")]
    [JsonPropertyName("anmeldungId")]
    public int AnmeldungId { get; set; }

    /// <summary>
    /// Name of the person making the payment
    /// </summary>
    [MaxLength(100, ErrorMessage = "Name darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    /// <summary>
    /// Email of the person making the payment
    /// </summary>
    [MaxLength(100, ErrorMessage = "Email darf maximal 100 Zeichen lang sein")]
    [EmailAddress(ErrorMessage = "Ungültige E-Mail-Adresse")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Payment amount
    /// </summary>
    [Required(ErrorMessage = "Betrag ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [Required(ErrorMessage = "WaehrungId ist erforderlich")]
    [JsonPropertyName("waehrungId")]
    public int WaehrungId { get; set; }

    /// <summary>
    /// Payment date
    /// </summary>
    [Required(ErrorMessage = "Zahlungsdatum ist erforderlich")]
    [JsonPropertyName("zahlungsdatum")]
    public DateTime Zahlungsdatum { get; set; }

    /// <summary>
    /// Payment method
    /// </summary>
    [MaxLength(30, ErrorMessage = "Zahlungsweg darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [MaxLength(100, ErrorMessage = "Referenz darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [Required(ErrorMessage = "StatusId ist erforderlich")]
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }
}

