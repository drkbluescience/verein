using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderung;

/// <summary>
/// Data Transfer Object for MitgliedForderung entity
/// </summary>
public class MitgliedForderungDto
{
    /// <summary>
    /// Forderung identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Mitglied identifier
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Payment type identifier
    /// </summary>
    [JsonPropertyName("zahlungTypId")]
    public int ZahlungTypId { get; set; }

    /// <summary>
    /// Claim/Invoice number
    /// </summary>
    [JsonPropertyName("forderungsnummer")]
    public string? Forderungsnummer { get; set; }

    /// <summary>
    /// Claim amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int WaehrungId { get; set; }

    /// <summary>
    /// Year of the claim
    /// </summary>
    [JsonPropertyName("jahr")]
    public int? Jahr { get; set; }

    /// <summary>
    /// Quarter of the claim (1-4)
    /// </summary>
    [JsonPropertyName("quartal")]
    public int? Quartal { get; set; }

    /// <summary>
    /// Month of the claim (1-12)
    /// </summary>
    [JsonPropertyName("monat")]
    public int? Monat { get; set; }

    /// <summary>
    /// Due date
    /// </summary>
    [JsonPropertyName("faelligkeit")]
    public DateTime Faelligkeit { get; set; }

    /// <summary>
    /// Description of the claim
    /// </summary>
    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }

    /// <summary>
    /// Payment date (when the claim was paid)
    /// </summary>
    [JsonPropertyName("bezahltAm")]
    public DateTime? BezahltAm { get; set; }

    /// <summary>
    /// Amount already paid (partial payments from MitgliedForderungZahlung)
    /// </summary>
    [JsonPropertyName("paidAmount")]
    public decimal PaidAmount { get; set; }

    /// <summary>
    /// Remaining amount to be paid (Betrag - PaidAmount)
    /// </summary>
    [JsonPropertyName("remainingAmount")]
    public decimal RemainingAmount { get; set; }

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

    /// <summary>
    /// Modified timestamp
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }
}

