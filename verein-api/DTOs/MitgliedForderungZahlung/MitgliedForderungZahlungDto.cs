using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderungZahlung;

/// <summary>
/// Data Transfer Object for MitgliedForderungZahlung entity
/// </summary>
public class MitgliedForderungZahlungDto
{
    /// <summary>
    /// ForderungZahlung identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Forderung identifier
    /// </summary>
    [JsonPropertyName("forderungId")]
    public int ForderungId { get; set; }

    /// <summary>
    /// Zahlung identifier
    /// </summary>
    [JsonPropertyName("zahlungId")]
    public int ZahlungId { get; set; }

    /// <summary>
    /// Allocated amount from payment to claim
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Created timestamp
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }
}

