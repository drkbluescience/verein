using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Veranstaltung entity representing verein events and activities
/// </summary>
[Table("Veranstaltung")]
public class Veranstaltung : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Event title
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Titel { get; set; } = string.Empty;

    /// <summary>
    /// Event description
    /// </summary>
    [MaxLength(1000)]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Event start date and time
    /// </summary>
    [Required]
    [Column(TypeName = "datetime")]
    public DateTime Startdatum { get; set; }

    /// <summary>
    /// Event end date and time
    /// </summary>
    [Column(TypeName = "datetime")]
    public DateTime? Enddatum { get; set; }

    /// <summary>
    /// Event price (if applicable)
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? Preis { get; set; }

    /// <summary>
    /// Currency identifier (foreign key to Currency table)
    /// </summary>
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Event location
    /// </summary>
    [MaxLength(250)]
    public string? Ort { get; set; }

    /// <summary>
    /// Only for members flag
    /// </summary>
    public bool NurFuerMitglieder { get; set; }

    /// <summary>
    /// Maximum number of participants
    /// </summary>
    public int? MaxTeilnehmer { get; set; }

    /// <summary>
    /// Registration required flag
    /// </summary>
    public bool AnmeldeErforderlich { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that owns this event
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Event registrations (one-to-many relationship)
    /// </summary>
    public virtual ICollection<VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; } = new List<VeranstaltungAnmeldung>();

    /// <summary>
    /// Event images (one-to-many relationship)
    /// </summary>
    public virtual ICollection<VeranstaltungBild> VeranstaltungBilder { get; set; } = new List<VeranstaltungBild>();
}
