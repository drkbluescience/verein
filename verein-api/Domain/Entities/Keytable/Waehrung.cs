using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Waehrung (Currency) lookup table
/// </summary>
[Table("Waehrung", Schema = "Keytable")]
public class Waehrung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Currency code (e.g., "EUR", "USD", "TRY", "GBP")
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this currency
    /// </summary>
    public virtual ICollection<WaehrungUebersetzung> Uebersetzungen { get; set; } = new List<WaehrungUebersetzung>();
}

