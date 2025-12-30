using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Kassenbuch;

/// <summary>
/// Data Transfer Object for creating a new Kassenbuch entry
/// </summary>
public class CreateKassenbuchDto
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Receipt date
    /// </summary>
    [Required(ErrorMessage = "BelegDatum ist erforderlich")]
    [JsonPropertyName("belegDatum")]
    public DateTime BelegDatum { get; set; }

    /// <summary>
    /// Account number reference
    /// </summary>
    [Required(ErrorMessage = "FiBuNummer ist erforderlich")]
    [MaxLength(10, ErrorMessage = "FiBuNummer darf maximal 10 Zeichen lang sein")]
    [JsonPropertyName("fiBuNummer")]
    public string FiBuNummer { get; set; } = string.Empty;

    /// <summary>
    /// Purpose/description
    /// </summary>
    [MaxLength(500, ErrorMessage = "Verwendungszweck darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("verwendungszweck")]
    public string? Verwendungszweck { get; set; }

    [JsonPropertyName("buchungstext")]
    public string? Buchungstext
    {
        get => Verwendungszweck;
        set => Verwendungszweck = value;
    }

    /// <summary>
    /// Cash income
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "EinnahmeKasse muss positiv sein")]
    [JsonPropertyName("einnahmeKasse")]
    public decimal? EinnahmeKasse { get; set; }

    [JsonPropertyName("kasseEinnahme")]
    public decimal? KasseEinnahme
    {
        get => EinnahmeKasse;
        set => EinnahmeKasse = value;
    }

    /// <summary>
    /// Cash expense
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "AusgabeKasse muss positiv sein")]
    [JsonPropertyName("ausgabeKasse")]
    public decimal? AusgabeKasse { get; set; }

    [JsonPropertyName("kasseAusgabe")]
    public decimal? KasseAusgabe
    {
        get => AusgabeKasse;
        set => AusgabeKasse = value;
    }

    /// <summary>
    /// Bank income
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "EinnahmeBank muss positiv sein")]
    [JsonPropertyName("einnahmeBank")]
    public decimal? EinnahmeBank { get; set; }

    [JsonPropertyName("bankEinnahme")]
    public decimal? BankEinnahme
    {
        get => EinnahmeBank;
        set => EinnahmeBank = value;
    }

    /// <summary>
    /// Bank expense
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "AusgabeBank muss positiv sein")]
    [JsonPropertyName("ausgabeBank")]
    public decimal? AusgabeBank { get; set; }

    [JsonPropertyName("bankAusgabe")]
    public decimal? BankAusgabe
    {
        get => AusgabeBank;
        set => AusgabeBank = value;
    }

    /// <summary>
    /// Fiscal year (auto-calculated from BelegDatum if not provided)
    /// </summary>
    [JsonPropertyName("jahr")]
    public int? Jahr { get; set; }

    /// <summary>
    /// Related member (optional)
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Related member payment (optional)
    /// </summary>
    [JsonPropertyName("mitgliedZahlungId")]
    public int? MitgliedZahlungId { get; set; }

    /// <summary>
    /// Related bank transaction (optional)
    /// </summary>
    [JsonPropertyName("bankBuchungId")]
    public int? BankBuchungId { get; set; }

    /// <summary>
    /// Payment method: BAR, UEBERWEISUNG, LASTSCHRIFT, EC_KARTE
    /// </summary>
    [MaxLength(30, ErrorMessage = "Zahlungsweg darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    [JsonPropertyName("notiz")]
    public string? Notiz
    {
        get => Bemerkung;
        set => Bemerkung = value;
    }
}
