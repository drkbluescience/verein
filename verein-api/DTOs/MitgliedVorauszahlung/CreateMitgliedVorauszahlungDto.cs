using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedVorauszahlung;

/// <summary>
/// Data Transfer Object for creating MitgliedVorauszahlung
/// </summary>
public class CreateMitgliedVorauszahlungDto
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
    /// Zahlung identifier
    /// </summary>
    [Required(ErrorMessage = "ZahlungId ist erforderlich")]
    [JsonPropertyName("zahlungId")]
    public int ZahlungId { get; set; }

    /// <summary>
    /// Remaining advance payment amount
    /// </summary>
    [Required(ErrorMessage = "Betrag ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }
}

