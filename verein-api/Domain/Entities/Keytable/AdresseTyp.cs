using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// AdresseTyp (Address Type) lookup table
/// </summary>
[Table("AdresseTyp", Schema = "Keytable")]
public class AdresseTyp
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "HOME", "WORK", "BILLING", "SHIPPING")
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this address type
    /// </summary>
    public virtual ICollection<AdresseTypUebersetzung> Uebersetzungen { get; set; } = new List<AdresseTypUebersetzung>();
}

