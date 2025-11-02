using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungZahlung;

/// <summary>
/// Data Transfer Object for updating VeranstaltungZahlung
/// </summary>
public class UpdateVeranstaltungZahlungDto
{
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
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal? Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Payment date
    /// </summary>
    [JsonPropertyName("zahlungsdatum")]
    public DateTime? Zahlungsdatum { get; set; }

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
    [JsonPropertyName("statusId")]
    public int? StatusId { get; set; }
}

