using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Kassenbuch;

/// <summary>
/// Data Transfer Object for Kassenbuch (Cash Book) entity
/// </summary>
public class KassenbuchDto
{
    /// <summary>
    /// Entry identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Association identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Receipt number (auto-incremented per year)
    /// </summary>
    [JsonPropertyName("belegNr")]
    public int BelegNr { get; set; }

    /// <summary>
    /// Receipt date
    /// </summary>
    [JsonPropertyName("belegDatum")]
    public DateTime BelegDatum { get; set; }

    /// <summary>
    /// Account number reference
    /// </summary>
    [JsonPropertyName("fiBuNummer")]
    public string FiBuNummer { get; set; } = string.Empty;

    /// <summary>
    /// Purpose/description
    /// </summary>
    [JsonPropertyName("verwendungszweck")]
    public string? Verwendungszweck { get; set; }

    [JsonPropertyName("buchungstext")]
    public string? Buchungstext => Verwendungszweck;

    /// <summary>
    /// Cash income
    /// </summary>
    [JsonPropertyName("einnahmeKasse")]
    public decimal? EinnahmeKasse { get; set; }

    [JsonPropertyName("kasseEinnahme")]
    public decimal? KasseEinnahme => EinnahmeKasse;

    /// <summary>
    /// Cash expense
    /// </summary>
    [JsonPropertyName("ausgabeKasse")]
    public decimal? AusgabeKasse { get; set; }

    [JsonPropertyName("kasseAusgabe")]
    public decimal? KasseAusgabe => AusgabeKasse;

    /// <summary>
    /// Bank income
    /// </summary>
    [JsonPropertyName("einnahmeBank")]
    public decimal? EinnahmeBank { get; set; }

    [JsonPropertyName("bankEinnahme")]
    public decimal? BankEinnahme => EinnahmeBank;

    /// <summary>
    /// Bank expense
    /// </summary>
    [JsonPropertyName("ausgabeBank")]
    public decimal? AusgabeBank { get; set; }

    [JsonPropertyName("bankAusgabe")]
    public decimal? BankAusgabe => AusgabeBank;

    /// <summary>
    /// Fiscal year
    /// </summary>
    [JsonPropertyName("jahr")]
    public int Jahr { get; set; }

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
    [JsonPropertyName("zahlungsweg")]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    [JsonPropertyName("notiz")]
    public string? Notiz => Bemerkung;

    /// <summary>
    /// Creation date
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Last modification date
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Account description (from FiBuKonto)
    /// </summary>
    [JsonPropertyName("fiBuKontoBezeichnung")]
    public string? FiBuKontoBezeichnung { get; set; }

    /// <summary>
    /// Member name (if linked)
    /// </summary>
    [JsonPropertyName("mitgliedName")]
    public string? MitgliedName { get; set; }
}
