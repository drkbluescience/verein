using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.BankBuchung;

/// <summary>
/// Data Transfer Object for updating BankBuchung
/// </summary>
public class UpdateBankBuchungDto
{
    /// <summary>
    /// Transaction date
    /// </summary>
    [JsonPropertyName("buchungsdatum")]
    public DateTime? Buchungsdatum { get; set; }

    /// <summary>
    /// Transaction amount
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
    /// Recipient/Sender name
    /// </summary>
    [MaxLength(100, ErrorMessage = "Empfaenger darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("empfaenger")]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Purpose of transaction
    /// </summary>
    [MaxLength(250, ErrorMessage = "Verwendungszweck darf maximal 250 Zeichen lang sein")]
    [JsonPropertyName("verwendungszweck")]
    public string? Verwendungszweck { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [MaxLength(100, ErrorMessage = "Referenz darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("referenz")]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status identifier
    /// </summary>
    [JsonPropertyName("statusId")]
    public int? StatusId { get; set; }
}

