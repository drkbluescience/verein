using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderungZahlung;

/// <summary>
/// Data Transfer Object for creating MitgliedForderungZahlung
/// </summary>
public class CreateMitgliedForderungZahlungDto
{
    /// <summary>
    /// Forderung identifier
    /// </summary>
    [Required(ErrorMessage = "ForderungId ist erforderlich")]
    [JsonPropertyName("forderungId")]
    public int ForderungId { get; set; }

    /// <summary>
    /// Zahlung identifier
    /// </summary>
    [Required(ErrorMessage = "ZahlungId ist erforderlich")]
    [JsonPropertyName("zahlungId")]
    public int ZahlungId { get; set; }

    /// <summary>
    /// Allocated amount from payment to claim
    /// </summary>
    [Required(ErrorMessage = "Betrag ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }
}

