using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.FiBuKonto;

/// <summary>
/// Data Transfer Object for updating an existing FiBuKonto
/// </summary>
public class UpdateFiBuKontoDto
{
    /// <summary>
    /// Account identifier
    /// </summary>
    [Required(ErrorMessage = "Id ist erforderlich")]
    [JsonPropertyName("id")]
    public int Id { get; set; }

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
    /// Main business area: A=Ideeller Bereich, B=Vermögensverwaltung, C=Zweckbetrieb, D=Geschäftsbetrieb
    /// </summary>
    [Required(ErrorMessage = "Hauptbereich ist erforderlich")]
    [MaxLength(1, ErrorMessage = "Hauptbereich muss ein einzelnes Zeichen sein")]
    [RegularExpression("^[ABCD]$", ErrorMessage = "Hauptbereich muss A, B, C oder D sein")]
    [JsonPropertyName("hauptbereich")]
    public string Hauptbereich { get; set; } = string.Empty;

    /// <summary>
    /// Account area: KASSE, BANK, KASSE_BANK
    /// </summary>
    [Required(ErrorMessage = "Bereich ist erforderlich")]
    [MaxLength(20, ErrorMessage = "Bereich darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("bereich")]
    public string Bereich { get; set; } = string.Empty;

    /// <summary>
    /// Account type: EINNAHMEN, AUSGABEN, EIN_AUSG
    /// </summary>
    [Required(ErrorMessage = "Typ ist erforderlich")]
    [MaxLength(20, ErrorMessage = "Typ darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("typ")]
    public string Typ { get; set; } = string.Empty;

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
}

