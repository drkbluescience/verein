using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedVorauszahlung;

/// <summary>
/// Data Transfer Object for updating MitgliedVorauszahlung
/// </summary>
public class UpdateMitgliedVorauszahlungDto
{
    /// <summary>
    /// Remaining advance payment amount
    /// </summary>
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal? Betrag { get; set; }
}

