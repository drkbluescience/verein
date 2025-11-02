using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// ZahlungTyp (Payment Type) lookup table
/// </summary>
[Table("ZahlungTyp", Schema = "Keytable")]
public class ZahlungTyp
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Unique code (e.g., "CASH", "CHECK", "BANK_TRANSFER", "CREDIT_CARD")
    /// </summary>
    [Required]
    [MaxLength(30)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this payment type
    /// </summary>
    public virtual ICollection<ZahlungTypUebersetzung> Uebersetzungen { get; set; } = new List<ZahlungTypUebersetzung>();
}

