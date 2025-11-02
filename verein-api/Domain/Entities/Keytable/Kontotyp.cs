using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Kontotyp (Account Type) lookup table
/// </summary>
[Table("Kontotyp", Schema = "Keytable")]
public class Kontotyp
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "CHECKING", "SAVINGS", "BUSINESS")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this account type
    /// </summary>
    public virtual ICollection<KontotypUebersetzung> Uebersetzungen { get; set; } = new List<KontotypUebersetzung>();
}

