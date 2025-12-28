using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.SpendenProtokoll;

/// <summary>
/// Data Transfer Object for creating a new SpendenProtokoll
/// </summary>
public class CreateSpendenProtokollDto
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Counting date
    /// </summary>
    [Required(ErrorMessage = "Datum ist erforderlich")]
    [JsonPropertyName("datum")]
    public DateTime Datum { get; set; }

    /// <summary>
    /// Purpose of the donation
    /// </summary>
    [Required(ErrorMessage = "Zweck ist erforderlich")]
    [MaxLength(200, ErrorMessage = "Zweck darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("zweck")]
    public string Zweck { get; set; } = string.Empty;

    /// <summary>
    /// Purpose category: GENEL, KURBAN, ZEKAT, FITRE, DEPREM, CAMI, EGITIM
    /// </summary>
    [MaxLength(30, ErrorMessage = "ZweckKategorie darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("zweckKategorie")]
    public string? ZweckKategorie { get; set; }

    /// <summary>
    /// Name of the counter
    /// </summary>
    [Required(ErrorMessage = "Protokollant ist erforderlich")]
    [MaxLength(100, ErrorMessage = "Protokollant darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("protokollant")]
    public string Protokollant { get; set; } = string.Empty;

    /// <summary>
    /// First witness name
    /// </summary>
    [MaxLength(100, ErrorMessage = "Zeuge1Name darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("zeuge1Name")]
    public string? Zeuge1Name { get; set; }

    /// <summary>
    /// Second witness name
    /// </summary>
    [MaxLength(100, ErrorMessage = "Zeuge2Name darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("zeuge2Name")]
    public string? Zeuge2Name { get; set; }

    /// <summary>
    /// Third witness name (optional)
    /// </summary>
    [MaxLength(100, ErrorMessage = "Zeuge3Name darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("zeuge3Name")]
    public string? Zeuge3Name { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500, ErrorMessage = "Bemerkung darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Denomination details for cash counting
    /// </summary>
    [JsonPropertyName("details")]
    public List<CreateSpendenProtokollDetailDto> Details { get; set; } = new();
}

/// <summary>
/// Data Transfer Object for creating SpendenProtokollDetail
/// </summary>
public class CreateSpendenProtokollDetailDto
{
    /// <summary>
    /// Denomination value (e.g., 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01)
    /// </summary>
    [Required(ErrorMessage = "Wert ist erforderlich")]
    [Range(0.01, 500, ErrorMessage = "Wert muss zwischen 0.01 und 500 liegen")]
    [JsonPropertyName("wert")]
    public decimal Wert { get; set; }

    /// <summary>
    /// Count of this denomination
    /// </summary>
    [Required(ErrorMessage = "Anzahl ist erforderlich")]
    [Range(0, int.MaxValue, ErrorMessage = "Anzahl muss positiv sein")]
    [JsonPropertyName("anzahl")]
    public int Anzahl { get; set; }
}

