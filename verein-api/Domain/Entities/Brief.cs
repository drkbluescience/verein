using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Brief entity representing letter drafts
/// </summary>
[Table("Brief", Schema = "Brief")]
public class Brief : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Template identifier (optional, if created from template)
    /// </summary>
    public int? VorlageId { get; set; }

    /// <summary>
    /// Internal title for the draft
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Titel { get; set; } = string.Empty;

    /// <summary>
    /// Subject line shown to recipient
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Betreff { get; set; } = string.Empty;

    /// <summary>
    /// HTML content with placeholders
    /// </summary>
    [Required]
    public string Inhalt { get; set; } = string.Empty;

    /// <summary>
    /// URL of the logo image
    /// </summary>
    [MaxLength(500)]
    public string? LogoUrl { get; set; }

    /// <summary>
    /// Logo position (top, left, right, none)
    /// </summary>
    [MaxLength(20)]
    public string LogoPosition { get; set; } = "top";

    /// <summary>
    /// Font family
    /// </summary>
    [MaxLength(50)]
    public string Schriftart { get; set; } = "Arial";

    /// <summary>
    /// Font size in pixels
    /// </summary>
    public int Schriftgroesse { get; set; } = 14;

    /// <summary>
    /// Status (Entwurf, Gesendet)
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Entwurf";

    // Navigation properties
    /// <summary>
    /// Verein that owns this draft
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Template this draft was created from
    /// </summary>
    public virtual BriefVorlage? Vorlage { get; set; }

    /// <summary>
    /// Messages sent from this draft
    /// </summary>
    public virtual ICollection<Nachricht> Nachrichten { get; set; } = new List<Nachricht>();
}

