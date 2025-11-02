using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedZahlung;

/// <summary>
/// Data Transfer Object for updating MitgliedZahlung
/// </summary>
public class UpdateMitgliedZahlungDto
{
    /// <summary>
    /// Forderung identifier (optional)
    /// </summary>
    [JsonPropertyName("forderungId")]
    public int? ForderungId { get; set; }

    /// <summary>
    /// Payment type identifier
    /// </summary>
    [JsonPropertyName("zahlungTypId")]
    public int? ZahlungTypId { get; set; }

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
    [JsonPropertyName("statusId")]
    public int? StatusId { get; set; }

    /// <summary>
    /// Bank transaction identifier (optional)
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }
}

