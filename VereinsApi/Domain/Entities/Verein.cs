using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Verein entity representing an organization/verein
/// </summary>
[Table("Verein")]
public class Verein : AuditableEntity
{
    /// <summary>
    /// Full name of the verein
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name or abbreviation of the verein
    /// </summary>
    [MaxLength(50)]
    public string? Kurzname { get; set; }

    /// <summary>
    /// Official verein registration number
    /// </summary>
    [MaxLength(30)]
    public string? Vereinsnummer { get; set; }

    /// <summary>
    /// Tax identification number
    /// </summary>
    [MaxLength(30)]
    public string? Steuernummer { get; set; }

    /// <summary>
    /// Legal form identifier
    /// </summary>
    public int? RechtsformId { get; set; }

    /// <summary>
    /// Date when the verein was founded
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? Gruendungsdatum { get; set; }

    /// <summary>
    /// Purpose or mission statement of the verein
    /// </summary>
    [MaxLength(500)]
    public string? Zweck { get; set; }

    /// <summary>
    /// Main address identifier (foreign key to Adresse table)
    /// </summary>
    public int? AdresseId { get; set; }

    /// <summary>
    /// Main bank account identifier (foreign key to Bankkonto table)
    /// </summary>
    public int? HauptBankkontoId { get; set; }

    /// <summary>
    /// Primary phone number
    /// </summary>
    [MaxLength(30)]
    public string? Telefon { get; set; }

    /// <summary>
    /// Fax number
    /// </summary>
    [MaxLength(30)]
    public string? Fax { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    [MaxLength(200)]
    [Url]
    public string? Webseite { get; set; }

    /// <summary>
    /// Social media links (JSON or comma-separated)
    /// </summary>
    [MaxLength(500)]
    public string? SocialMediaLinks { get; set; }

    /// <summary>
    /// Name of the current chairman/president
    /// </summary>
    [MaxLength(100)]
    public string? Vorstandsvorsitzender { get; set; }

    /// <summary>
    /// Name of the current manager
    /// </summary>
    [MaxLength(100)]
    public string? Geschaeftsfuehrer { get; set; }

    /// <summary>
    /// Email address of the representative
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? VertreterEmail { get; set; }

    /// <summary>
    /// Name of the primary contact person
    /// </summary>
    [MaxLength(100)]
    public string? Kontaktperson { get; set; }

    /// <summary>
    /// Number of members in the verein
    /// </summary>
    public int? Mitgliederzahl { get; set; }

    /// <summary>
    /// File path to the verein's statute document
    /// </summary>
    [MaxLength(200)]
    public string? SatzungPfad { get; set; }

    /// <summary>
    /// File path to the verein's logo
    /// </summary>
    [MaxLength(200)]
    public string? LogoPfad { get; set; }

    /// <summary>
    /// External reference identifier for integration purposes
    /// </summary>
    [MaxLength(50)]
    public string? ExterneReferenzId { get; set; }

    /// <summary>
    /// Client code for system identification
    /// </summary>
    [MaxLength(50)]
    public string? Mandantencode { get; set; }

    /// <summary>
    /// Electronic post receive address
    /// </summary>
    [MaxLength(100)]
    public string? EPostEmpfangAdresse { get; set; }

    /// <summary>
    /// SEPA creditor identifier for direct debit
    /// </summary>
    [MaxLength(50)]
    public string? SEPA_GlaeubigerID { get; set; }

    /// <summary>
    /// VAT number for tax purposes
    /// </summary>
    [MaxLength(30)]
    public string? UstIdNr { get; set; }

    /// <summary>
    /// Electronic signature key for digital documents
    /// </summary>
    [MaxLength(100)]
    public string? ElektronischeSignaturKey { get; set; }

    // Navigation properties
    /// <summary>
    /// Main address of the verein (Hauptadresse)
    /// </summary>
    public virtual Adresse? HauptAdresse { get; set; }

    /// <summary>
    /// Main bank account of the verein (Hauptbankkonto)
    /// </summary>
    public virtual Bankkonto? HauptBankkonto { get; set; }

    /// <summary>
    /// All addresses of this verein
    /// </summary>
    public virtual ICollection<Adresse> Adressen { get; set; } = new List<Adresse>();

    /// <summary>
    /// All bank accounts of this verein
    /// </summary>
    public virtual ICollection<Bankkonto> Bankkonten { get; set; } = new List<Bankkonto>();

    /// <summary>
    /// Events organized by this verein
    /// </summary>
    public virtual ICollection<Veranstaltung> Veranstaltungen { get; set; } = new List<Veranstaltung>();

    /// <summary>
    /// Members of this verein
    /// </summary>
    public virtual ICollection<Mitglied> Mitglieder { get; set; } = new List<Mitglied>();

    /// <summary>
    /// Family relationships within this verein
    /// </summary>
    public virtual ICollection<MitgliedFamilie> MitgliedFamilien { get; set; } = new List<MitgliedFamilie>();
}
