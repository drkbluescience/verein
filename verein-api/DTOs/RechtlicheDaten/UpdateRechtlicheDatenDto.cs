using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.RechtlicheDaten;

/// <summary>
/// Data Transfer Object for updating RechtlicheDaten
/// </summary>
public class UpdateRechtlicheDatenDto
{
    // Registergericht (Court Registration)
    [StringLength(200)]
    [JsonPropertyName("registergerichtName")]
    public string? RegistergerichtName { get; set; }

    [StringLength(50)]
    [JsonPropertyName("registergerichtNummer")]
    public string? RegistergerichtNummer { get; set; }

    [StringLength(100)]
    [JsonPropertyName("registergerichtOrt")]
    public string? RegistergerichtOrt { get; set; }

    [JsonPropertyName("registergerichtEintragungsdatum")]
    public DateTime? RegistergerichtEintragungsdatum { get; set; }

    // Finanzamt (Tax Office)
    [StringLength(200)]
    [JsonPropertyName("finanzamtName")]
    public string? FinanzamtName { get; set; }

    [StringLength(50)]
    [JsonPropertyName("finanzamtNummer")]
    public string? FinanzamtNummer { get; set; }

    [StringLength(100)]
    [JsonPropertyName("finanzamtOrt")]
    public string? FinanzamtOrt { get; set; }

    // Tax Status
    [JsonPropertyName("steuerpflichtig")]
    public bool? Steuerpflichtig { get; set; }

    [JsonPropertyName("steuerbefreit")]
    public bool? Steuerbefreit { get; set; }

    [JsonPropertyName("gemeinnuetzigAnerkannt")]
    public bool? GemeinnuetzigAnerkannt { get; set; }

    [JsonPropertyName("gemeinnuetzigkeitBis")]
    public DateTime? GemeinnuetzigkeitBis { get; set; }

    // Document Paths
    [StringLength(500)]
    [JsonPropertyName("steuererklaerungPfad")]
    public string? SteuererklaerungPfad { get; set; }

    [JsonPropertyName("steuererklaerungJahr")]
    public int? SteuererklaerungJahr { get; set; }

    [StringLength(500)]
    [JsonPropertyName("steuerbefreiungPfad")]
    public string? SteuerbefreiungPfad { get; set; }

    [StringLength(500)]
    [JsonPropertyName("gemeinnuetzigkeitsbescheidPfad")]
    public string? GemeinnuetzigkeitsbescheidPfad { get; set; }

    [StringLength(500)]
    [JsonPropertyName("registerauszugPfad")]
    public string? RegisterauszugPfad { get; set; }

    // Notes
    [StringLength(1000)]
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }
}

