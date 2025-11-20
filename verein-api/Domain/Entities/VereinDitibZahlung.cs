using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// VereinDitibZahlung entity representing association payments to DITIB
/// </summary>
[Table("VereinDitibZahlung", Schema = "Finanz")]
public class VereinDitibZahlung : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Payment amount
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
    /// Payment date
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime Zahlungsdatum { get; set; }

    /// <summary>
    /// Payment period (e.g., "2024-11" for November 2024)
    /// </summary>
    [Required]
    [MaxLength(7)]
    public string Zahlungsperiode { get; set; } = string.Empty;

    /// <summary>
    /// Payment method (e.g., Cash, Bank Transfer, etc.)
    /// </summary>
    [MaxLength(30)]
    public string? Zahlungsweg { get; set; }

    /// <summary>
    /// Bank account identifier (foreign key to Bankkonto table) - optional
    /// </summary>
    public int? BankkontoId { get; set; }

    /// <summary>
    /// Reference number
    /// </summary>
    [MaxLength(100)]
    public string? Referenz { get; set; }

    /// <summary>
    /// Notes/Remarks
    /// </summary>
    [MaxLength(250)]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Status identifier (foreign key to Keytable.ZahlungStatus)
    /// </summary>
    [Required]
    public int StatusId { get; set; }

    /// <summary>
    /// Bank transaction identifier (foreign key to BankBuchung table) - optional
    /// </summary>
    public int? BankBuchungId { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that made this payment
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Bank account used for this payment
    /// </summary>
    public virtual Bankkonto? Bankkonto { get; set; }

    /// <summary>
    /// Bank transaction linked to this payment
    /// </summary>
    public virtual BankBuchung? BankBuchung { get; set; }
}

