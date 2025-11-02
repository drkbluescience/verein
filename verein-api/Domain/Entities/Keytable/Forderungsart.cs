using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Forderungsart (Claim Type) lookup table
/// </summary>
[Table("Forderungsart", Schema = "Keytable")]
public class Forderungsart
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "MEMBERSHIP_FEE", "FINE", "DONATION", "OTHER")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this claim type
    /// </summary>
    public virtual ICollection<ForderungsartUebersetzung> Uebersetzungen { get; set; } = new List<ForderungsartUebersetzung>();
}

