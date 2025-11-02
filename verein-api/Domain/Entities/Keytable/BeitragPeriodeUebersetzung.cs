using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for BeitragPeriode (Contribution Period) lookup table
/// </summary>
[Table("BeitragPeriodeUebersetzung", Schema = "Keytable")]
public class BeitragPeriodeUebersetzung
{
    /// <summary>
    /// Foreign key to BeitragPeriode table (Code)
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string BeitragPeriodeCode { get; set; } = string.Empty;

    /// <summary>
    /// Language code (e.g., "de", "en", "tr")
    /// </summary>
    [Required]
    [MaxLength(2)]
    public string Sprache { get; set; } = string.Empty;

    /// <summary>
    /// Translated name
    /// </summary>
    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Composite primary key: BeitragPeriodeCode + Sprache
    /// </summary>
    [Key]
    public string Id => $"{BeitragPeriodeCode}_{Sprache}";

    /// <summary>
    /// Navigation property to BeitragPeriode
    /// </summary>
    public virtual BeitragPeriode? BeitragPeriode { get; set; }
}

