using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.FiBuKonto;

/// <summary>
/// Data Transfer Object for FiBuKonto (Chart of Accounts) entity
/// </summary>
public class FiBuKontoDto
{
    /// <summary>
    /// Account identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Account number (e.g., "2110", "3220")
    /// </summary>
    [JsonPropertyName("nummer")]
    public string Nummer { get; set; } = string.Empty;

    /// <summary>
    /// Account description
    /// </summary>
    [JsonPropertyName("bezeichnung")]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Main business area: A=Ideeller Bereich, B=Vermögensverwaltung, C=Zweckbetrieb, D=Geschäftsbetrieb
    /// </summary>
    [JsonPropertyName("hauptbereich")]
    public string Hauptbereich { get; set; } = string.Empty;

    /// <summary>
    /// Account area: KASSE, BANK, KASSE_BANK
    /// </summary>
    [JsonPropertyName("bereich")]
    public string Bereich { get; set; } = string.Empty;

    /// <summary>
    /// Account type: EINNAHMEN, AUSGABEN, EIN_AUSG
    /// </summary>
    [JsonPropertyName("typ")]
    public string Typ { get; set; } = string.Empty;

    /// <summary>
    /// EÜR position in tax report (optional)
    /// </summary>
    [JsonPropertyName("euerPosition")]
    public string? EuerPosition { get; set; }

    /// <summary>
    /// Sort order for display
    /// </summary>
    [JsonPropertyName("sortierung")]
    public int Sortierung { get; set; }

    /// <summary>
    /// Optional link to ZahlungTyp
    /// </summary>
    [JsonPropertyName("zahlungTypId")]
    public int? ZahlungTypId { get; set; }

    /// <summary>
    /// Is the account active
    /// </summary>
    [JsonPropertyName("isAktiv")]
    public bool IsAktiv { get; set; }

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
}

