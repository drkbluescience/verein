using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Auth;

/// <summary>
/// Data Transfer Object for member registration
/// </summary>
public class RegisterMitgliedDto
{
    /// <summary>
    /// First name
    /// </summary>
    [Required(ErrorMessage = "Vorname ist erforderlich")]
    [MaxLength(100, ErrorMessage = "Vorname darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("vorname")]
    public string Vorname { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    [Required(ErrorMessage = "Nachname ist erforderlich")]
    [MaxLength(100, ErrorMessage = "Nachname darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("nachname")]
    public string Nachname { get; set; } = string.Empty;

    /// <summary>
    /// Email address
    /// </summary>
    [Required(ErrorMessage = "E-Mail ist erforderlich")]
    [EmailAddress(ErrorMessage = "Ungültige E-Mail-Adresse")]
    [MaxLength(100, ErrorMessage = "E-Mail darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

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
    /// Date of birth
    /// </summary>
    [JsonPropertyName("geburtsdatum")]
    public DateTime? Geburtsdatum { get; set; }

    /// <summary>
    /// Place of birth
    /// </summary>
    [MaxLength(100, ErrorMessage = "Geburtsort darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("geburtsort")]
    public string? Geburtsort { get; set; }
}

