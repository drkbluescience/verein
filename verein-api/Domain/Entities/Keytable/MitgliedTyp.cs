using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// MitgliedTyp (Member Type) lookup table
/// </summary>
[Table("MitgliedTyp", Schema = "Keytable")]
public class MitgliedTyp
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "INDIVIDUAL", "CORPORATE", "FAMILY")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this member type
    /// </summary>
    public virtual ICollection<MitgliedTypUebersetzung> Uebersetzungen { get; set; } = new List<MitgliedTypUebersetzung>();
}

