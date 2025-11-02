using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// MitgliedFamilieStatus (Family Member Status) lookup table
/// </summary>
[Table("MitgliedFamilieStatus", Schema = "Keytable")]
public class MitgliedFamilieStatus
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "ACTIVE", "INACTIVE", "DECEASED")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this family member status
    /// </summary>
    public virtual ICollection<MitgliedFamilieStatusUebersetzung> Uebersetzungen { get; set; } = new List<MitgliedFamilieStatusUebersetzung>();
}

