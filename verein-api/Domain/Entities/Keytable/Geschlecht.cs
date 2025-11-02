using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Geschlecht (Gender) lookup table
/// </summary>
[Table("Geschlecht", Schema = "Keytable")]
public class Geschlecht
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "M", "F", "O")
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this gender
    /// </summary>
    public virtual ICollection<GeschlechtUebersetzung> Uebersetzungen { get; set; } = new List<GeschlechtUebersetzung>();
}

