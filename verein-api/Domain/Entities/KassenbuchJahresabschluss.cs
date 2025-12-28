using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// KassenbuchJahresabschluss entity representing the year-end closing balance.
/// Stores opening and closing balances for cash, bank, and savings accounts.
/// Required for annual financial reporting and carry-over to next year.
/// </summary>
[Table("KassenbuchJahresabschluss", Schema = "Finanz")]
public class KassenbuchJahresabschluss : AuditableEntity
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Fiscal year for the closing
    /// </summary>
    [Required]
    public int Jahr { get; set; }

    /// <summary>
    /// Cash opening balance (Kasa açılış bakiyesi)
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal KasseAnfangsbestand { get; set; }

    /// <summary>
    /// Cash closing balance (Kasa kapanış bakiyesi)
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal KasseEndbestand { get; set; }

    /// <summary>
    /// Bank opening balance (Banka açılış bakiyesi)
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal BankAnfangsbestand { get; set; }

    /// <summary>
    /// Bank closing balance (Banka kapanış bakiyesi)
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal BankEndbestand { get; set; }

    /// <summary>
    /// Savings account closing balance (Tasarruf hesabı) - optional
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? SparbuchEndbestand { get; set; }

    /// <summary>
    /// Date when the year was closed
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime AbschlussDatum { get; set; }

    /// <summary>
    /// Whether the closing has been audited
    /// </summary>
    public bool Geprueft { get; set; } = false;

    /// <summary>
    /// Name of the auditor
    /// </summary>
    [MaxLength(100)]
    public string? GeprueftVon { get; set; }

    /// <summary>
    /// Date of the audit
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GeprueftAm { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500)]
    public string? Bemerkung { get; set; }

    // Navigation properties

    /// <summary>
    /// Related association
    /// </summary>
    public virtual Verein? Verein { get; set; }
}

