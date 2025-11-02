using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for FamilienbeziehungTyp (Family Relationship Type) lookup table
/// </summary>
[Table("FamilienbeziehungTypUebersetzung", Schema = "Keytable")]
public class FamilienbeziehungTypUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to FamilienbeziehungTyp table
    /// </summary>
    [Required]
    public int FamilienbeziehungTypId { get; set; }

    /// <summary>
    /// Language code (e.g., "de", "en", "tr")
    /// </summary>
    [Required]
    [MaxLength(2)]
    public string Sprache { get; set; } = string.Empty;

    /// <summary>
    /// Translated name
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Navigation property to FamilienbeziehungTyp
    /// </summary>
    public virtual FamilienbeziehungTyp? FamilienbeziehungTyp { get; set; }
}

