using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.KassenbuchJahresabschluss;

/// <summary>
/// Data Transfer Object for creating a new KassenbuchJahresabschluss
/// </summary>
public class CreateKassenbuchJahresabschlussDto
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Fiscal year
    /// </summary>
    [Required(ErrorMessage = "Jahr ist erforderlich")]
    [Range(2000, 2100, ErrorMessage = "Jahr muss zwischen 2000 und 2100 liegen")]
    [JsonPropertyName("jahr")]
    public int Jahr { get; set; }

    /// <summary>
    /// Cash opening balance
    /// </summary>
    [Required(ErrorMessage = "KasseAnfangsbestand ist erforderlich")]
    [JsonPropertyName("kasseAnfangsbestand")]
    public decimal KasseAnfangsbestand { get; set; }

    /// <summary>
    /// Cash closing balance
    /// </summary>
    [Required(ErrorMessage = "KasseEndbestand ist erforderlich")]
    [JsonPropertyName("kasseEndbestand")]
    public decimal KasseEndbestand { get; set; }

    /// <summary>
    /// Bank opening balance
    /// </summary>
    [Required(ErrorMessage = "BankAnfangsbestand ist erforderlich")]
    [JsonPropertyName("bankAnfangsbestand")]
    public decimal BankAnfangsbestand { get; set; }

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
    /// Additional notes
    /// </summary>
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

