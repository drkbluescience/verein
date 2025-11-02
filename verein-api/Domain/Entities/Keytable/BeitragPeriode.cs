using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// BeitragPeriode (Contribution Period) lookup table
/// Uses Code as primary key instead of Id
/// </summary>
[Table("BeitragPeriode", Schema = "Keytable")]
public class BeitragPeriode
{
    /// <summary>
    /// Unique code as primary key (e.g., "MONTHLY", "QUARTERLY", "ANNUAL")
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
    /// Translations for this contribution period
    /// </summary>
    public virtual ICollection<BeitragPeriodeUebersetzung> Uebersetzungen { get; set; } = new List<BeitragPeriodeUebersetzung>();
}

