using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// BankBuchung entity representing bank account transactions
/// </summary>
[Table("BankBuchung", Schema = "Finanz")]
public class BankBuchung : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Bank account identifier (foreign key to Bankkonto table)
    /// </summary>
    [Required]
    public int BankKontoId { get; set; }

    /// <summary>
    /// Transaction date
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime Buchungsdatum { get; set; }

    /// <summary>
    /// Transaction amount
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency identifier (foreign key to Keytable.Waehrung)
    /// </summary>
    [Required]
    public int WaehrungId { get; set; }

    /// <summary>
    /// Recipient/Sender name
    /// </summary>
    [MaxLength(100)]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Purpose of transaction
    /// </summary>
    [MaxLength(250)]
    public string? Verwendungszweck { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [MaxLength(100)]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status identifier (foreign key to Keytable.Status)
    /// </summary>
    [Required]
    public int StatusId { get; set; }

    /// <summary>
    /// Creation timestamp (additional to audit Created field)
    /// </summary>
    public DateTime? AngelegtAm { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that owns this transaction
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Bank account for this transaction
    /// </summary>
    public virtual Bankkonto? BankKonto { get; set; }

    /// <summary>
    /// Member payments linked to this bank transaction
    /// </summary>
    public virtual ICollection<MitgliedZahlung> MitgliedZahlungen { get; set; } = new List<MitgliedZahlung>();
}

