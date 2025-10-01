using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Verein;

/// <summary>
/// Data Transfer Object for creating a new Verein
/// </summary>
public class CreateVereinDto
{
    /// <summary>
    /// Full name of the verein
    /// </summary>
    [Required(ErrorMessage = "Verein name is required")]
    [StringLength(200, ErrorMessage = "Verein name cannot exceed 200 characters")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name of the verein
    /// </summary>
    [StringLength(50, ErrorMessage = "Short name cannot exceed 50 characters")]
    [JsonPropertyName("kurzname")]
    public string? Kurzname { get; set; }

    /// <summary>
    /// Verein registration number
    /// </summary>
    [StringLength(30, ErrorMessage = "Verein number cannot exceed 30 characters")]
    [JsonPropertyName("vereinsnummer")]
    public string? Vereinsnummer { get; set; }

    /// <summary>
    /// Tax number
    /// </summary>
    [StringLength(30, ErrorMessage = "Tax number cannot exceed 30 characters")]
    [JsonPropertyName("steuernummer")]
    public string? Steuernummer { get; set; }

    /// <summary>
    /// Legal form identifier
    /// </summary>
    [JsonPropertyName("rechtsformId")]
    public int? RechtsformId { get; set; }

    /// <summary>
    /// Date when the verein was founded
    /// </summary>
    [DataType(DataType.Date)]
    [JsonPropertyName("gruendungsdatum")]
    public DateTime? Gruendungsdatum { get; set; }

    /// <summary>
    /// Purpose or description of the verein
    /// </summary>
    [StringLength(500, ErrorMessage = "Purpose cannot exceed 500 characters")]
    [JsonPropertyName("zweck")]
    public string? Zweck { get; set; }

    /// <summary>
    /// Address identifier
    /// </summary>
    [JsonPropertyName("adresseId")]
    public int? AdresseId { get; set; }

    /// <summary>
    /// Main bank account identifier
    /// </summary>
    [JsonPropertyName("hauptBankkontoId")]
    public int? HauptBankkontoId { get; set; }

    /// <summary>
    /// Primary phone number
    /// </summary>
    [Phone(ErrorMessage = "Please enter a valid phone number")]
    [StringLength(30, ErrorMessage = "Phone number cannot exceed 30 characters")]
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Fax number
    /// </summary>
    [StringLength(30, ErrorMessage = "Fax number cannot exceed 30 characters")]
    [JsonPropertyName("fax")]
    public string? Fax { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    [EmailAddress(ErrorMessage = "Please enter a valid email address")]
    [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    [Url(ErrorMessage = "Please enter a valid URL")]
    [StringLength(200, ErrorMessage = "Website URL cannot exceed 200 characters")]
    [JsonPropertyName("webseite")]
    public string? Webseite { get; set; }

    /// <summary>
    /// Social media links
    /// </summary>
    [StringLength(500, ErrorMessage = "Social media links cannot exceed 500 characters")]
    [JsonPropertyName("socialMediaLinks")]
    public string? SocialMediaLinks { get; set; }

    /// <summary>
    /// Chairman of the board
    /// </summary>
    [StringLength(100, ErrorMessage = "Chairman name cannot exceed 100 characters")]
    [JsonPropertyName("vorstandsvorsitzender")]
    public string? Vorstandsvorsitzender { get; set; }

    /// <summary>
    /// Managing director
    /// </summary>
    [StringLength(100, ErrorMessage = "Managing director name cannot exceed 100 characters")]
    [JsonPropertyName("geschaeftsfuehrer")]
    public string? Geschaeftsfuehrer { get; set; }

    /// <summary>
    /// Representative email
    /// </summary>
    [EmailAddress(ErrorMessage = "Please enter a valid representative email address")]
    [StringLength(100, ErrorMessage = "Representative email cannot exceed 100 characters")]
    [JsonPropertyName("vertreterEmail")]
    public string? VertreterEmail { get; set; }

    /// <summary>
    /// Contact person
    /// </summary>
    [StringLength(100, ErrorMessage = "Contact person name cannot exceed 100 characters")]
    [JsonPropertyName("kontaktperson")]
    public string? Kontaktperson { get; set; }

    /// <summary>
    /// Number of members
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Member count must be non-negative")]
    [JsonPropertyName("mitgliederzahl")]
    public int? Mitgliederzahl { get; set; }

    /// <summary>
    /// Path to statute document
    /// </summary>
    [StringLength(200, ErrorMessage = "Statute path cannot exceed 200 characters")]
    [JsonPropertyName("satzungPfad")]
    public string? SatzungPfad { get; set; }

    /// <summary>
    /// Path to logo file
    /// </summary>
    [StringLength(200, ErrorMessage = "Logo path cannot exceed 200 characters")]
    [JsonPropertyName("logoPfad")]
    public string? LogoPfad { get; set; }

    /// <summary>
    /// External reference ID
    /// </summary>
    [StringLength(50, ErrorMessage = "External reference ID cannot exceed 50 characters")]
    [JsonPropertyName("externeReferenzId")]
    public string? ExterneReferenzId { get; set; }

    /// <summary>
    /// Client code
    /// </summary>
    [StringLength(50, ErrorMessage = "Client code cannot exceed 50 characters")]
    [JsonPropertyName("mandantencode")]
    public string? Mandantencode { get; set; }

    /// <summary>
    /// E-Post receiving address
    /// </summary>
    [EmailAddress(ErrorMessage = "Please enter a valid E-Post address")]
    [StringLength(100, ErrorMessage = "E-Post address cannot exceed 100 characters")]
    [JsonPropertyName("ePostEmpfangAdresse")]
    public string? EPostEmpfangAdresse { get; set; }

    /// <summary>
    /// SEPA creditor ID
    /// </summary>
    [StringLength(50, ErrorMessage = "SEPA creditor ID cannot exceed 50 characters")]
    [JsonPropertyName("sepaGlaeubigerID")]
    public string? SEPA_GlaeubigerID { get; set; }

    /// <summary>
    /// VAT identification number
    /// </summary>
    [StringLength(30, ErrorMessage = "VAT ID cannot exceed 30 characters")]
    [JsonPropertyName("ustIdNr")]
    public string? UstIdNr { get; set; }

    /// <summary>
    /// Electronic signature key
    /// </summary>
    [StringLength(100, ErrorMessage = "Electronic signature key cannot exceed 100 characters")]
    [JsonPropertyName("elektronischeSignaturKey")]
    public string? ElektronischeSignaturKey { get; set; }
}
