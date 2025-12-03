using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// BriefVorlage entity representing letter templates
/// </summary>
[Table("BriefVorlage", Schema = "Brief")]
public class BriefVorlage : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Template name
    /// </summary>
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Template description
    /// </summary>
    [MaxLength(500)]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Subject line template
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Betreff { get; set; } = string.Empty;

    /// <summary>
    /// HTML content of the template
    /// </summary>
    [Required]
    public string Inhalt { get; set; } = string.Empty;

    /// <summary>
    /// Category (Willkommen, Zahlung, Einladung, Feiertag, Allgemein)
    /// </summary>
    [MaxLength(50)]
    public string? Kategorie { get; set; }

    /// <summary>
    /// Logo position (top, left, right, none)
    /// </summary>
    [MaxLength(20)]
    public string LogoPosition { get; set; } = "top";

    /// <summary>
    /// Default font family
    /// </summary>
    [MaxLength(50)]
    public string Schriftart { get; set; } = "Arial";

    /// <summary>
    /// Default font size in pixels
    /// </summary>
    public int Schriftgroesse { get; set; } = 14;

    /// <summary>
    /// Is this a system template (read-only for users)
    /// </summary>
    public bool IstSystemvorlage { get; set; } = false;

    /// <summary>
    /// Is template active
    /// </summary>
    public bool IstAktiv { get; set; } = true;

    // Navigation properties
    /// <summary>
    /// Verein that owns this template
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Letters created from this template
    /// </summary>
    public virtual ICollection<Brief> Briefe { get; set; } = new List<Brief>();
}

