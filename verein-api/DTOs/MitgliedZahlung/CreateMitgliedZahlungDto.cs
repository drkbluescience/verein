using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedZahlung;

/// <summary>
/// Data Transfer Object for creating MitgliedZahlung
/// </summary>
public class CreateMitgliedZahlungDto
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Mitglied identifier
    /// </summary>
    [Required(ErrorMessage = "MitgliedId ist erforderlich")]
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Forderung identifier (optional)
    /// </summary>
    [JsonPropertyName("forderungId")]
    public int? ForderungId { get; set; }

    /// <summary>
    /// Payment type identifier
    /// </summary>
    [Required(ErrorMessage = "ZahlungTypId ist erforderlich")]
    [JsonPropertyName("zahlungTypId")]
    public int ZahlungTypId { get; set; }

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
    /// Bank account identifier (optional)
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
    /// Bank transaction identifier (optional)
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }
}

