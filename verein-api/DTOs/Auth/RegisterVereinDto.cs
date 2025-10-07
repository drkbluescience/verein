using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Auth;

/// <summary>
/// Data Transfer Object for verein registration
/// </summary>
public class RegisterVereinDto
{
    /// <summary>
    /// Full name of the verein
    /// </summary>
    [Required(ErrorMessage = "Verein name ist erforderlich")]
    [MaxLength(200, ErrorMessage = "Verein name darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name of the verein
    /// </summary>
    [MaxLength(50, ErrorMessage = "Kurzname darf maximal 50 Zeichen lang sein")]
    [JsonPropertyName("kurzname")]
    public string? Kurzname { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    [Required(ErrorMessage = "E-Mail ist erforderlich")]
    [EmailAddress(ErrorMessage = "Ungültige E-Mail-Adresse")]
    [MaxLength(100, ErrorMessage = "E-Mail darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Primary phone number
    /// </summary>
    [MaxLength(30, ErrorMessage = "Telefon darf maximal 30 Zeichen lang sein")]
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Chairman of the board
    /// </summary>
    [MaxLength(100, ErrorMessage = "Vorstandsvorsitzender darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("vorstandsvorsitzender")]
    public string? Vorstandsvorsitzender { get; set; }

    /// <summary>
    /// Contact person
    /// </summary>
    [MaxLength(100, ErrorMessage = "Kontaktperson darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("kontaktperson")]
    public string? Kontaktperson { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    [Url(ErrorMessage = "Ungültige URL")]
    [MaxLength(200, ErrorMessage = "Webseite darf maximal 200 Zeichen lang sein")]
    [JsonPropertyName("webseite")]
    public string? Webseite { get; set; }

    /// <summary>
    /// Date when the verein was founded
    /// </summary>
    [JsonPropertyName("gruendungsdatum")]
    public DateTime? Gruendungsdatum { get; set; }

    /// <summary>
    /// Purpose or description of the verein
    /// </summary>
    [MaxLength(500, ErrorMessage = "Zweck darf maximal 500 Zeichen lang sein")]
    [JsonPropertyName("zweck")]
    public string? Zweck { get; set; }
}

