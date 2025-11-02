using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Rechtsform (Legal Form) lookup table
/// </summary>
[Table("Rechtsform", Schema = "Keytable")]
public class Rechtsform
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "EV", "GMBH", "AG", "GGMBH")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this legal form
    /// </summary>
    public virtual ICollection<RechtsformUebersetzung> Uebersetzungen { get; set; } = new List<RechtsformUebersetzung>();
}

