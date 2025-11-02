using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// FamilienbeziehungTyp (Family Relationship Type) lookup table
/// </summary>
[Table("FamilienbeziehungTyp", Schema = "Keytable")]
public class FamilienbeziehungTyp
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "PARENT", "CHILD", "SIBLING", "SPOUSE")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this relationship type
    /// </summary>
    public virtual ICollection<FamilienbeziehungTypUebersetzung> Uebersetzungen { get; set; } = new List<FamilienbeziehungTypUebersetzung>();
}

