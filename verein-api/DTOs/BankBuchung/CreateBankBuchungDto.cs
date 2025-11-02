using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.BankBuchung;

/// <summary>
/// Data Transfer Object for creating BankBuchung
/// </summary>
public class CreateBankBuchungDto
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Bank account identifier
    /// </summary>
    [Required(ErrorMessage = "BankKontoId ist erforderlich")]
    [JsonPropertyName("bankKontoId")]
    public int BankKontoId { get; set; }

    /// <summary>
    /// Transaction date
    /// </summary>
    [Required(ErrorMessage = "Buchungsdatum ist erforderlich")]
    [JsonPropertyName("buchungsdatum")]
    public DateTime Buchungsdatum { get; set; }

    /// <summary>
    /// Transaction amount
    /// </summary>
    [Required(ErrorMessage = "Betrag ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Betrag muss größer als 0 sein")]
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier
    /// </summary>
    [Required(ErrorMessage = "WaehrungId ist erforderlich")]
    [JsonPropertyName("waehrungId")]
    public int WaehrungId { get; set; }

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
    [Required(ErrorMessage = "StatusId ist erforderlich")]
    [JsonPropertyName("statusId")]
    public int StatusId { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    [JsonPropertyName("angelegtAm")]
    public DateTime? AngelegtAm { get; set; }
}

