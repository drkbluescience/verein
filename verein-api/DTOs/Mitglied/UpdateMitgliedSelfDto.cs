using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Mitglied;

/// <summary>
/// Data Transfer Object for member self-updates (limited fields)
/// </summary>
public class UpdateMitgliedSelfDto
{
    /// <summary>
    /// Email address
    /// </summary>
    [EmailAddress(ErrorMessage = "Ungueltige E-Mail-Adresse")]
    [MaxLength(100, ErrorMessage = "E-Mail darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    [MaxLength(30, ErrorMessage = "Telefon darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Mobile phone number
    /// </summary>
    [MaxLength(30, ErrorMessage = "Mobiltelefon darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("mobiltelefon")]
    public string? Mobiltelefon { get; set; }

    /// <summary>
    /// Payment period code (monthly, yearly, etc.)
    /// </summary>
    [MaxLength(20, ErrorMessage = "BeitragPeriodeCode darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("beitragPeriodeCode")]
    public string? BeitragPeriodeCode { get; set; }

    /// <summary>
    /// Payment day of the period
    /// </summary>
    [Range(1, 31, ErrorMessage = "BeitragZahlungsTag muss zwischen 1 und 31 liegen")]
    [JsonPropertyName("beitragZahlungsTag")]
    public int? BeitragZahlungsTag { get; set; }

    /// <summary>
    /// Payment day type code
    /// </summary>
    [MaxLength(20, ErrorMessage = "BeitragZahlungstagTypCode darf maximal 20 Zeichen lang sein")]
    [JsonPropertyName("beitragZahlungstagTypCode")]
    public string? BeitragZahlungstagTypCode { get; set; }
}
