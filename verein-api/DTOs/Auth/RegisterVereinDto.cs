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
    /// Primary email address (institutional email for the verein)
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
    /// Chairman of the board (full name)
    /// </summary>
    [MaxLength(100, ErrorMessage = "Vorstandsvorsitzender darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("vorstandsvorsitzender")]
    public string? Vorstandsvorsitzender { get; set; }

    /// <summary>
    /// Chairman's personal email address (used for login)
    /// </summary>
    [EmailAddress(ErrorMessage = "Ungültige E-Mail-Adresse")]
    [MaxLength(100, ErrorMessage = "Vorstandsvorsitzender E-Mail darf maximal 100 Zeichen lang sein")]
    [JsonPropertyName("vorstandsvorsitzenderEmail")]
    public string? VorstandsvorsitzenderEmail { get; set; }

    /// <summary>
    /// Password for chairman login
    /// </summary>
    [Required(ErrorMessage = "Şifre gereklidir")]
    [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
    [MaxLength(100, ErrorMessage = "Şifre en fazla 100 karakter olabilir")]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Password confirmation
    /// </summary>
    [Required(ErrorMessage = "Şifre onayı gereklidir")]
    [Compare("Password", ErrorMessage = "Şifreler eşleşmiyor")]
    [JsonPropertyName("confirmPassword")]
    public string ConfirmPassword { get; set; } = string.Empty;

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

