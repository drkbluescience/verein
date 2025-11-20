using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// VereinSatzung entity representing statute/bylaws versions for a Verein
/// </summary>
[Table("VereinSatzung", Schema = "Verein")]
public class VereinSatzung : AuditableEntity
{
    /// <summary>
    /// Foreign key to Verein
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// File path to the statute document (Word format)
    /// </summary>
    [Required]
    [MaxLength(500)]
    public string DosyaPfad { get; set; } = string.Empty;

    /// <summary>
    /// Date when this statute version was adopted/effective
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime SatzungVom { get; set; }

    /// <summary>
    /// Whether this is the active/current statute version
    /// </summary>
    [Required]
    public bool Aktif { get; set; } = true;

    /// <summary>
    /// Notes or remarks about this statute version
    /// </summary>
    [MaxLength(500)]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Original file name
    /// </summary>
    [MaxLength(200)]
    public string? DosyaAdi { get; set; }

    /// <summary>
    /// File size in bytes
    /// </summary>
    public long? DosyaBoyutu { get; set; }

    // Navigation properties
    /// <summary>
    /// Navigation property to Verein
    /// </summary>
    [ForeignKey("VereinId")]
    public virtual Verein? Verein { get; set; }
}

