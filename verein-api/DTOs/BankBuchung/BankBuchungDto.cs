using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.BankBuchung;

/// <summary>
/// Data Transfer Object for BankBuchung entity
/// </summary>
public class BankBuchungDto
{
    /// <summary>
    /// BankBuchung identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Bank account identifier
    /// </summary>
    [JsonPropertyName("bankKontoId")]
    public int BankKontoId { get; set; }

    /// <summary>
    /// Transaction date
    /// </summary>
    [JsonPropertyName("buchungsdatum")]
    public DateTime Buchungsdatum { get; set; }

    /// <summary>
    /// Transaction amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int WaehrungId { get; set; }

    /// <summary>
    /// Recipient/Sender name
    /// </summary>
    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Purpose of transaction
    /// </summary>
    [JsonPropertyName("verwendungszweck")]
    public string? Verwendungszweck { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    [JsonPropertyName("angelegtAm")]
    public DateTime? AngelegtAm { get; set; }

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

