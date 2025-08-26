using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Verein;

/// <summary>
/// Data Transfer Object for Verein entity
/// </summary>
public class VereinDto
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Full name of the verein
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name of the verein
    /// </summary>
    [JsonPropertyName("kurzname")]
    public string? Kurzname { get; set; }

    /// <summary>
    /// Verein registration number
    /// </summary>
    [JsonPropertyName("vereinsnummer")]
    public string? Vereinsnummer { get; set; }

    /// <summary>
    /// Tax number
    /// </summary>
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
    [JsonPropertyName("gruendungsdatum")]
    public DateTime? Gruendungsdatum { get; set; }

    /// <summary>
    /// Purpose or description of the verein
    /// </summary>
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
    [JsonPropertyName("telefon")]
    public string? Telefon { get; set; }

    /// <summary>
    /// Fax number
    /// </summary>
    [JsonPropertyName("fax")]
    public string? Fax { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    [JsonPropertyName("webseite")]
    public string? Webseite { get; set; }

    /// <summary>
    /// Social media links
    /// </summary>
    [JsonPropertyName("socialMediaLinks")]
    public string? SocialMediaLinks { get; set; }

    /// <summary>
    /// Chairman of the board
    /// </summary>
    [JsonPropertyName("vorstandsvorsitzender")]
    public string? Vorstandsvorsitzender { get; set; }

    /// <summary>
    /// Managing director
    /// </summary>
    [JsonPropertyName("geschaeftsfuehrer")]
    public string? Geschaeftsfuehrer { get; set; }

    /// <summary>
    /// Representative email
    /// </summary>
    [JsonPropertyName("vertreterEmail")]
    public string? VertreterEmail { get; set; }

    /// <summary>
    /// Contact person
    /// </summary>
    [JsonPropertyName("kontaktperson")]
    public string? Kontaktperson { get; set; }

    /// <summary>
    /// Number of members
    /// </summary>
    [JsonPropertyName("mitgliederzahl")]
    public int? Mitgliederzahl { get; set; }

    /// <summary>
    /// Path to statute document
    /// </summary>
    [JsonPropertyName("satzungPfad")]
    public string? SatzungPfad { get; set; }

    /// <summary>
    /// Path to logo file
    /// </summary>
    [JsonPropertyName("logoPfad")]
    public string? LogoPfad { get; set; }

    /// <summary>
    /// External reference ID
    /// </summary>
    [JsonPropertyName("externeReferenzId")]
    public string? ExterneReferenzId { get; set; }

    /// <summary>
    /// Client code
    /// </summary>
    [JsonPropertyName("mandantencode")]
    public string? Mandantencode { get; set; }

    /// <summary>
    /// E-Post receiving address
    /// </summary>
    [JsonPropertyName("ePostEmpfangAdresse")]
    public string? EPostEmpfangAdresse { get; set; }

    /// <summary>
    /// SEPA creditor ID
    /// </summary>
    [JsonPropertyName("sepaGlaeubigerID")]
    public string? SEPA_GlaeubigerID { get; set; }

    /// <summary>
    /// VAT identification number
    /// </summary>
    [JsonPropertyName("ustIdNr")]
    public string? UstIdNr { get; set; }

    /// <summary>
    /// Electronic signature key
    /// </summary>
    [JsonPropertyName("elektronischeSignaturKey")]
    public string? ElektronischeSignaturKey { get; set; }

    /// <summary>
    /// Is the verein currently active
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }

    /// <summary>
    /// Creation date
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification date
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }
}
