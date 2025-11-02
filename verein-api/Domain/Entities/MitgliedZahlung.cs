using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// MitgliedZahlung entity representing member payments
/// </summary>
[Table("MitgliedZahlung", Schema = "Finanz")]
public class MitgliedZahlung : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Member identifier (foreign key to Mitglied table)
    /// </summary>
    [Required]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Claim identifier (foreign key to MitgliedForderung table) - optional
    /// </summary>
    public int? ForderungId { get; set; }

    /// <summary>
    /// Payment type identifier (foreign key to Keytable.ZahlungTyp)
    /// </summary>
    [Required]
    public int ZahlungTypId { get; set; }

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
    /// Status identifier (foreign key to Keytable.Status)
    /// </summary>
    [Required]
    public int StatusId { get; set; }

    /// <summary>
    /// Bank transaction identifier (foreign key to BankBuchung table) - optional
    /// </summary>
    public int? BankBuchungId { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that owns this payment
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Member who made this payment
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }

    /// <summary>
    /// Claim this payment is for (if applicable)
    /// </summary>
    public virtual MitgliedForderung? Forderung { get; set; }

    /// <summary>
    /// Bank account used for this payment
    /// </summary>
    public virtual Bankkonto? Bankkonto { get; set; }

    /// <summary>
    /// Bank transaction linked to this payment
    /// </summary>
    public virtual BankBuchung? BankBuchung { get; set; }

    /// <summary>
    /// Payment allocations to claims
    /// </summary>
    public virtual ICollection<MitgliedForderungZahlung> ForderungZahlungen { get; set; } = new List<MitgliedForderungZahlung>();

    /// <summary>
    /// Advance payments using this payment
    /// </summary>
    public virtual ICollection<MitgliedVorauszahlung> Vorauszahlungen { get; set; } = new List<MitgliedVorauszahlung>();
}

