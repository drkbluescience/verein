using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderung;

/// <summary>
/// Data Transfer Object for updating MitgliedForderung
/// </summary>
public class UpdateMitgliedForderungDto
{
    /// <summary>
    /// Payment type identifier
    /// </summary>
    [JsonPropertyName("zahlungTypId")]
    public int? ZahlungTypId { get; set; }

    /// <summary>
    /// Claim/Invoice number
    /// </summary>
    [MaxLength(50, ErrorMessage = "Forderungsnummer darf maximal 50 Zeichen lang sein")]
    [JsonPropertyName("forderungsnummer")]
    public string? Forderungsnummer { get; set; }

    /// <summary>
    /// Claim amount
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
    /// Year of the claim
    /// </summary>
    [Range(2000, 2100, ErrorMessage = "Jahr muss zwischen 2000 und 2100 liegen")]
    [JsonPropertyName("jahr")]
    public int? Jahr { get; set; }

    /// <summary>
    /// Quarter of the claim (1-4)
    /// </summary>
    [Range(1, 4, ErrorMessage = "Quartal muss zwischen 1 und 4 liegen")]
    [JsonPropertyName("quartal")]
    public int? Quartal { get; set; }

    /// <summary>
    /// Month of the claim (1-12)
    /// </summary>
    [Range(1, 12, ErrorMessage = "Monat muss zwischen 1 und 12 liegen")]
    [JsonPropertyName("monat")]
    public int? Monat { get; set; }

    /// <summary>
    /// Due date
    /// </summary>
    [JsonPropertyName("faelligkeit")]
    public DateTime? Faelligkeit { get; set; }

    /// <summary>
    /// Description of the claim
    /// </summary>
    [MaxLength(250, ErrorMessage = "Beschreibung darf maximal 250 Zeichen lang sein")]
    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [JsonPropertyName("statusId")]
    public int? StatusId { get; set; }

    /// <summary>
    /// Payment date (when the claim was paid)
    /// </summary>
    [JsonPropertyName("bezahltAm")]
    public DateTime? BezahltAm { get; set; }
}

