using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VereinDitibZahlung;

/// <summary>
/// Data Transfer Object for creating VereinDitibZahlung
/// </summary>
public class CreateVereinDitibZahlungDto
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

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
    /// Payment period (e.g., "2024-11")
    /// </summary>
    [Required(ErrorMessage = "Zahlungsperiode ist erforderlich")]
    [MaxLength(7, ErrorMessage = "Zahlungsperiode darf maximal 7 Zeichen lang sein")]
    [RegularExpression(@"^\d{4}-\d{2}$", ErrorMessage = "Zahlungsperiode muss im Format YYYY-MM sein")]
    [JsonPropertyName("zahlungsperiode")]
    public string Zahlungsperiode { get; set; } = string.Empty;

    /// <summary>
    /// Payment method
    /// </summary>
    [MaxLength(30, ErrorMessage = "Zahlungsweg darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Bank account identifier
    /// </summary>
    [JsonPropertyName("bankkontoId")]
    public int? BankkontoId { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [MaxLength(100, ErrorMessage = "Referenz darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Notes/Remarks
    /// </summary>
    [MaxLength(250, ErrorMessage = "Bemerkung darf maximal 250 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [Required(ErrorMessage = "StatusId ist erforderlich")]
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }

    /// <summary>
    /// Bank transaction identifier
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }
}

