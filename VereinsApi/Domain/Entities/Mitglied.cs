using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Mitglied entity representing association members
/// </summary>
[Table("Mitglied", Schema = "Mitglied")]
public class Mitglied : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Unique member number
    /// </summary>
    [Required]
    [MaxLength(30)]
    public string Mitgliedsnummer { get; set; } = string.Empty;

    /// <summary>
    /// Member status identifier (foreign key to MitgliedStatus table)
    /// </summary>
    [Required]
    public int MitgliedStatusId { get; set; }

    /// <summary>
    /// Member type identifier (foreign key to MitgliedTyp table)
    /// </summary>
    [Required]
    public int MitgliedTypId { get; set; }

    /// <summary>
    /// First name of the member
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Vorname { get; set; } = string.Empty;

    /// <summary>
    /// Last name of the member
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Nachname { get; set; } = string.Empty;

    /// <summary>
    /// Gender identifier (foreign key to Geschlecht table)
    /// </summary>
    public int? GeschlechtId { get; set; }

    /// <summary>
    /// Date of birth
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? Geburtsdatum { get; set; }

    /// <summary>
    /// Place of birth
    /// </summary>
    [MaxLength(100)]
    public string? Geburtsort { get; set; }

    /// <summary>
    /// Nationality identifier (foreign key to Staatsangehoerigkeit table)
    /// </summary>
    public int? StaatsangehoerigkeitId { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    [MaxLength(30)]
    public string? Telefon { get; set; }

    /// <summary>
    /// Mobile phone number
    /// </summary>
    [MaxLength(30)]
    public string? Mobiltelefon { get; set; }

    /// <summary>
    /// Date when member joined the association
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? Eintrittsdatum { get; set; }

    /// <summary>
    /// Date when member left the association
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? Austrittsdatum { get; set; }

    /// <summary>
    /// Additional notes about the member
    /// </summary>
    [MaxLength(250)]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Membership fee amount
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? BeitragBetrag { get; set; }

    /// <summary>
    /// Currency identifier for membership fee (foreign key to Waehrung table)
    /// </summary>
    public int? BeitragWaehrungId { get; set; }

    /// <summary>
    /// Membership fee period code (foreign key to BeitragPeriode table)
    /// </summary>
    [MaxLength(20)]
    public string? BeitragPeriodeCode { get; set; }

    /// <summary>
    /// Payment day for membership fee
    /// </summary>
    public int? BeitragZahlungsTag { get; set; }

    /// <summary>
    /// Payment day type code for membership fee (foreign key to BeitragZahlungstagTyp table)
    /// </summary>
    [MaxLength(20)]
    public string? BeitragZahlungstagTypCode { get; set; }

    /// <summary>
    /// Indicates if membership fee is mandatory
    /// </summary>
    public bool? BeitragIstPflicht { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that this member belongs to
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Addresses of this member (one-to-many relationship)
    /// </summary>
    public virtual ICollection<MitgliedAdresse> MitgliedAdressen { get; set; } = new List<MitgliedAdresse>();

    /// <summary>
    /// Family relationships where this member is the child/dependent (one-to-many relationship)
    /// </summary>
    public virtual ICollection<MitgliedFamilie> FamilienbeziehungenAlsKind { get; set; } = new List<MitgliedFamilie>();

    /// <summary>
    /// Family relationships where this member is the parent/guardian (one-to-many relationship)
    /// </summary>
    public virtual ICollection<MitgliedFamilie> FamilienbeziehungenAlsElternteil { get; set; } = new List<MitgliedFamilie>();

    /// <summary>
    /// Event registrations for this member (one-to-many relationship)
    /// </summary>
    public virtual ICollection<VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; } = new List<VeranstaltungAnmeldung>();
}
