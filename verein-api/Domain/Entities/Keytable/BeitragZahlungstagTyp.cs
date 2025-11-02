using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// BeitragZahlungstagTyp (Contribution Payment Day Type) lookup table
/// Uses Code as primary key instead of Id
/// </summary>
[Table("BeitragZahlungstagTyp", Schema = "Keytable")]
public class BeitragZahlungstagTyp
{
    /// <summary>
    /// Unique code as primary key (e.g., "FIRST_DAY", "LAST_DAY", "CUSTOM")
    /// </summary>
    [Key]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Sort order for display
    /// </summary>
    [Required]
    public int Sort { get; set; }

    /// <summary>
    /// Translations for this payment day type
    /// </summary>
    public virtual ICollection<BeitragZahlungstagTypUebersetzung> Uebersetzungen { get; set; } = new List<BeitragZahlungstagTypUebersetzung>();
}

