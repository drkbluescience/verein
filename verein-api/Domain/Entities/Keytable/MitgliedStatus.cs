using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// MitgliedStatus (Member Status) lookup table
/// </summary>
[Table("MitgliedStatus", Schema = "Keytable")]
public class MitgliedStatus
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "ACTIVE", "INACTIVE", "SUSPENDED")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this status
    /// </summary>
    public virtual ICollection<MitgliedStatusUebersetzung> Uebersetzungen { get; set; } = new List<MitgliedStatusUebersetzung>();
}

