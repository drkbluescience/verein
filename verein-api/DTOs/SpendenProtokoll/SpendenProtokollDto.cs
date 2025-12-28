using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.SpendenProtokoll;

/// <summary>
/// Data Transfer Object for SpendenProtokoll (Donation Protocol) entity
/// </summary>
public class SpendenProtokollDto
{
    /// <summary>
    /// Protocol identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Association identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Counting date
    /// </summary>
    [JsonPropertyName("datum")]
    public DateTime Datum { get; set; }

    /// <summary>
    /// Purpose of the donation
    /// </summary>
    [JsonPropertyName("zweck")]
    public string Zweck { get; set; } = string.Empty;

    /// <summary>
    /// Purpose category: GENEL, KURBAN, ZEKAT, FITRE, DEPREM, CAMI, EGITIM
    /// </summary>
    [JsonPropertyName("zweckKategorie")]
    public string? ZweckKategorie { get; set; }

    /// <summary>
    /// Total amount counted
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Name of the counter
    /// </summary>
    [JsonPropertyName("protokollant")]
    public string Protokollant { get; set; } = string.Empty;

    /// <summary>
    /// First witness name
    /// </summary>
    [JsonPropertyName("zeuge1Name")]
    public string? Zeuge1Name { get; set; }

    /// <summary>
    /// First witness signed
    /// </summary>
    [JsonPropertyName("zeuge1Unterschrift")]
    public bool Zeuge1Unterschrift { get; set; }

    /// <summary>
    /// Second witness name
    /// </summary>
    [JsonPropertyName("zeuge2Name")]
    public string? Zeuge2Name { get; set; }

    /// <summary>
    /// Second witness signed
    /// </summary>
    [JsonPropertyName("zeuge2Unterschrift")]
    public bool Zeuge2Unterschrift { get; set; }

    /// <summary>
    /// Third witness name (optional)
    /// </summary>
    [JsonPropertyName("zeuge3Name")]
    public string? Zeuge3Name { get; set; }

    /// <summary>
    /// Third witness signed
    /// </summary>
    [JsonPropertyName("zeuge3Unterschrift")]
    public bool Zeuge3Unterschrift { get; set; }

    /// <summary>
    /// Link to Kassenbuch entry
    /// </summary>
    [JsonPropertyName("kassenbuchId")]
    public int? KassenbuchId { get; set; }

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
    /// Denomination details
    /// </summary>
    [JsonPropertyName("details")]
    public List<SpendenProtokollDetailDto> Details { get; set; } = new();
}

/// <summary>
/// Data Transfer Object for SpendenProtokollDetail
/// </summary>
public class SpendenProtokollDetailDto
{
    /// <summary>
    /// Detail identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Parent protocol identifier
    /// </summary>
    [JsonPropertyName("spendenProtokollId")]
    public int SpendenProtokollId { get; set; }

    /// <summary>
    /// Denomination value (e.g., 100, 50, 20, 10, 5, 2, 1, 0.50)
    /// </summary>
    [JsonPropertyName("wert")]
    public decimal Wert { get; set; }

    /// <summary>
    /// Count of this denomination
    /// </summary>
    [JsonPropertyName("anzahl")]
    public int Anzahl { get; set; }

    /// <summary>
    /// Subtotal for this denomination
    /// </summary>
    [JsonPropertyName("summe")]
    public decimal Summe { get; set; }
}

