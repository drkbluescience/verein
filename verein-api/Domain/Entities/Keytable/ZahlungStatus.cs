using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// ZahlungStatus (Payment Status) lookup table
/// </summary>
[Table("ZahlungStatus", Schema = "Keytable")]
public class ZahlungStatus
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "PENDING", "COMPLETED", "FAILED", "CANCELLED")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this payment status
    /// </summary>
    public virtual ICollection<ZahlungStatusUebersetzung> Uebersetzungen { get; set; } = new List<ZahlungStatusUebersetzung>();
}

