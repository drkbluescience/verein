using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.RechtlicheDaten;

/// <summary>
/// Data Transfer Object for RechtlicheDaten entity
/// </summary>
public class RechtlicheDatenDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    // Registergericht (Court Registration)
    [JsonPropertyName("registergerichtName")]
    public string? RegistergerichtName { get; set; }

    [JsonPropertyName("registergerichtNummer")]
    public string? RegistergerichtNummer { get; set; }

    [JsonPropertyName("registergerichtOrt")]
    public string? RegistergerichtOrt { get; set; }

    [JsonPropertyName("registergerichtEintragungsdatum")]
    public DateTime? RegistergerichtEintragungsdatum { get; set; }

    // Finanzamt (Tax Office)
    [JsonPropertyName("finanzamtName")]
    public string? FinanzamtName { get; set; }

    [JsonPropertyName("finanzamtNummer")]
    public string? FinanzamtNummer { get; set; }

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
    [JsonPropertyName("steuererklaerungPfad")]
    public string? SteuererklaerungPfad { get; set; }

    [JsonPropertyName("steuererklaerungJahr")]
    public int? SteuererklaerungJahr { get; set; }

    [JsonPropertyName("steuerbefreiungPfad")]
    public string? SteuerbefreiungPfad { get; set; }

    [JsonPropertyName("gemeinnuetzigkeitsbescheidPfad")]
    public string? GemeinnuetzigkeitsbescheidPfad { get; set; }

    [JsonPropertyName("registerauszugPfad")]
    public string? RegisterauszugPfad { get; set; }

    // Notes
    [JsonPropertyName("bemerkung")]
    public string? Bemerkung { get; set; }

    // Audit fields
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }
}

