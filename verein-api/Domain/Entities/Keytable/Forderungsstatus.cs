using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Forderungsstatus (Claim Status) lookup table
/// </summary>
[Table("Forderungsstatus", Schema = "Keytable")]
public class Forderungsstatus
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "OPEN", "CLOSED", "PAID", "OVERDUE")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this claim status
    /// </summary>
    public virtual ICollection<ForderungsstatusUebersetzung> Uebersetzungen { get; set; } = new List<ForderungsstatusUebersetzung>();
}

