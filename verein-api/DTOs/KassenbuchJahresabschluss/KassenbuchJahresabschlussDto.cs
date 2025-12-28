using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.KassenbuchJahresabschluss;

/// <summary>
/// Data Transfer Object for KassenbuchJahresabschluss (Year-End Closing) entity
/// </summary>
public class KassenbuchJahresabschlussDto
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
    /// Fiscal year
    /// </summary>
    [JsonPropertyName("jahr")]
    public int Jahr { get; set; }

    /// <summary>
    /// Cash opening balance
    /// </summary>
    [JsonPropertyName("kasseAnfangsbestand")]
    public decimal KasseAnfangsbestand { get; set; }

    /// <summary>
    /// Cash closing balance
    /// </summary>
    [JsonPropertyName("kasseEndbestand")]
    public decimal KasseEndbestand { get; set; }

    /// <summary>
    /// Bank opening balance
    /// </summary>
    [JsonPropertyName("bankAnfangsbestand")]
    public decimal BankAnfangsbestand { get; set; }

    /// <summary>
    /// Bank closing balance
    /// </summary>
    [JsonPropertyName("bankEndbestand")]
    public decimal BankEndbestand { get; set; }

    /// <summary>
    /// Savings account closing balance (optional)
    /// </summary>
    [JsonPropertyName("sparbuchEndbestand")]
    public decimal? SparbuchEndbestand { get; set; }

    /// <summary>
    /// Date of year-end closing
    /// </summary>
    [JsonPropertyName("abschlussDatum")]
    public DateTime AbschlussDatum { get; set; }

    /// <summary>
    /// Whether the closing has been audited
    /// </summary>
    [JsonPropertyName("geprueft")]
    public bool Geprueft { get; set; }

    /// <summary>
    /// Name of the auditor
    /// </summary>
    [JsonPropertyName("geprueftVon")]
    public string? GeprueftVon { get; set; }

    /// <summary>
    /// Date of the audit
    /// </summary>
    [JsonPropertyName("geprueftAm")]
    public DateTime? GeprueftAm { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

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
    /// Total assets (calculated)
    /// </summary>
    [JsonPropertyName("gesamtvermoegen")]
    public decimal Gesamtvermoegen => KasseEndbestand + BankEndbestand + (SparbuchEndbestand ?? 0);
}

