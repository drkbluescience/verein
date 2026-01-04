using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.FiBuKonto;

/// <summary>
/// Data Transfer Object for creating a new FiBuKonto
/// </summary>
public class CreateFiBuKontoDto
{
    /// <summary>
    /// Account number (e.g., "2110", "3220")
    /// </summary>
    [Required(ErrorMessage = "Nummer ist erforderlich")]
    [MaxLength(10, ErrorMessage = "Nummer darf maximal 10 Zeichen lang sein")]
    [JsonPropertyName("nummer")]
    public string Nummer { get; set; } = string.Empty;

    /// <summary>
    /// Account description
    /// </summary>
    [Required(ErrorMessage = "Bezeichnung ist erforderlich")]
    [MaxLength(200, ErrorMessage = "Bezeichnung darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("bezeichnung")]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Account description in Turkish (optional)
    /// </summary>
    [MaxLength(200, ErrorMessage = "BezeichnungTR darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("bezeichnungTr")]
    public string? BezeichnungTr { get; set; }

    /// <summary>
    /// Main business area: A=Ideeller Bereich, B=Vermögensverwaltung, C=Zweckbetrieb, D=Geschäftsbetrieb
    /// </summary>
    [MaxLength(1, ErrorMessage = "Hauptbereich muss ein einzelnes Zeichen sein")]
    [RegularExpression("^[ABCD]$", ErrorMessage = "Hauptbereich muss A, B, C oder D sein")]
    [JsonPropertyName("hauptbereich")]
    public string? Hauptbereich { get; set; }

    [JsonPropertyName("kategorie")]
    public string? Kategorie { get; set; }

    [JsonPropertyName("unterkategorie")]
    public string? Unterkategorie { get; set; }

    /// <summary>
    /// Account area: KASSE, BANK, KASSE_BANK
    /// </summary>
    [MaxLength(20, ErrorMessage = "Bereich darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("bereich")]
    public string? Bereich { get; set; }

    [JsonPropertyName("kontoTyp")]
    public string? KontoTyp { get; set; }

    /// <summary>
    /// Account type: EINNAHMEN, AUSGABEN, EIN_AUSG
    /// </summary>
    [MaxLength(20, ErrorMessage = "Typ darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("typ")]
    public string? Typ { get; set; }

    [JsonPropertyName("istEinnahme")]
    public bool? IstEinnahme { get; set; }

    [JsonPropertyName("istAusgabe")]
    public bool? IstAusgabe { get; set; }

    [JsonPropertyName("istDurchlaufend")]
    public bool? IstDurchlaufend { get; set; }

    [JsonPropertyName("beschreibung")]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// EÜR position in tax report (optional)
    /// </summary>
    [MaxLength(20, ErrorMessage = "EuerPosition darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("euerPosition")]
    public string? EuerPosition { get; set; }

    /// <summary>
    /// Sort order for display
    /// </summary>
    [JsonPropertyName("sortierung")]
    public int Sortierung { get; set; } = 0;

    /// <summary>
    /// Optional link to ZahlungTyp
    /// </summary>
    [JsonPropertyName("zahlungTypId")]
    public int? ZahlungTypId { get; set; }

    /// <summary>
    /// Is the account active
    /// </summary>
    [JsonPropertyName("isAktiv")]
    public bool? IsAktiv { get; set; }

    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}
