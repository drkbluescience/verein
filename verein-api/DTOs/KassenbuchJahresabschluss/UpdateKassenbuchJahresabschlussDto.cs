using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.KassenbuchJahresabschluss;

/// <summary>
/// Data Transfer Object for updating an existing KassenbuchJahresabschluss
/// </summary>
public class UpdateKassenbuchJahresabschlussDto
{
    /// <summary>
    /// Entry identifier
    /// </summary>
    [Required(ErrorMessage = "Id ist erforderlich")]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Cash closing balance
    /// </summary>
    [Required(ErrorMessage = "KasseEndbestand ist erforderlich")]
    [JsonPropertyName("kasseEndbestand")]
    public decimal KasseEndbestand { get; set; }

    /// <summary>
    /// Bank closing balance
    /// </summary>
    [Required(ErrorMessage = "BankEndbestand ist erforderlich")]
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
    [Required(ErrorMessage = "AbschlussDatum ist erforderlich")]
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
    [MaxLength(100, ErrorMessage = "GeprueftVon darf maximal 100 Zeichen lang sein")]
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
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

