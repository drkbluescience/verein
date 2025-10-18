using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// VeranstaltungBild entity representing images associated with events
/// </summary>
[Table("VeranstaltungBild")]
public class VeranstaltungBild : AuditableEntity
{
    /// <summary>
    /// Aktiv property is not mapped because this column doesn't exist in the database table
    /// </summary>
    [NotMapped]
    public new bool? Aktiv { get; set; }

    /// <summary>
    /// Event identifier (foreign key to Event table)
    /// </summary>
    [Required]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Path to the image file
    /// </summary>
    [Required]
    [MaxLength(500)]
    public string BildPfad { get; set; } = string.Empty;

    /// <summary>
    /// Sort order for displaying images
    /// </summary>
    [Required]
    public int Reihenfolge { get; set; } = 1;

    /// <summary>
    /// Image title
    /// </summary>
    [MaxLength(100)]
    public string? Titel { get; set; }



    // Navigation properties
    /// <summary>
    /// Event that owns this image
    /// </summary>
    public virtual Veranstaltung? Veranstaltung { get; set; }
}
