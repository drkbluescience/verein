using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderungZahlung;

/// <summary>
/// Data Transfer Object for updating MitgliedForderungZahlung
/// </summary>
public class UpdateMitgliedForderungZahlungDto
{
    /// <summary>
    /// Allocated amount from payment to claim
    /// </summary>
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal? Betrag { get; set; }
}

