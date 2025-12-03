using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Nachricht entity representing sent messages to members
/// </summary>
[Table("Nachricht", Schema = "Brief")]
public class Nachricht
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Brief identifier (source letter draft)
    /// </summary>
    [Required]
    public int BriefId { get; set; }

    /// <summary>
    /// Verein identifier (sender)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Mitglied identifier (recipient)
    /// </summary>
    [Required]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Subject line
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Betreff { get; set; } = string.Empty;

    /// <summary>
    /// HTML content with member data filled in
    /// </summary>
    [Required]
    public string Inhalt { get; set; } = string.Empty;

    /// <summary>
    /// URL of the logo image
    /// </summary>
    [MaxLength(500)]
    public string? LogoUrl { get; set; }

    /// <summary>
    /// Is message read by recipient
    /// </summary>
    public bool IstGelesen { get; set; } = false;

    /// <summary>
    /// Date when message was read
    /// </summary>
    public DateTime? GelesenDatum { get; set; }

    /// <summary>
    /// Date when message was sent
    /// </summary>
    public DateTime GesendetDatum { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Soft delete flag (member deleted the message)
    /// </summary>
    public bool DeletedFlag { get; set; } = false;

    // Navigation properties
    /// <summary>
    /// Source letter draft
    /// </summary>
    public virtual Brief? Brief { get; set; }

    /// <summary>
    /// Sender verein
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Recipient member
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }
}

