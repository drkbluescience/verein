using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// MitgliedForderung entity representing member claims/invoices
/// </summary>
[Table("MitgliedForderung", Schema = "Finanz")]
public class MitgliedForderung : AuditableEntity
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
    /// Payment type identifier (foreign key to Keytable.ZahlungTyp)
    /// </summary>
    [Required]
    public int ZahlungTypId { get; set; }

    /// <summary>
    /// Claim/Invoice number
    /// </summary>
    [MaxLength(50)]
    public string? Forderungsnummer { get; set; }

    /// <summary>
    /// Claim amount
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
    /// Year of the claim
    /// </summary>
    public int? Jahr { get; set; }

    /// <summary>
    /// Quarter of the claim (1-4)
    /// </summary>
    public int? Quartal { get; set; }

    /// <summary>
    /// Month of the claim (1-12)
    /// </summary>
    public int? Monat { get; set; }

    /// <summary>
    /// Due date
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime Faelligkeit { get; set; }

    /// <summary>
    /// Description of the claim
    /// </summary>
    [MaxLength(250)]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Status identifier (foreign key to Keytable.Status)
    /// </summary>
    [Required]
    public int StatusId { get; set; }

    /// <summary>
    /// Payment date (when the claim was paid)
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? BezahltAm { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that owns this claim
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Member who owes this claim
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }

    /// <summary>
    /// Payments linked to this claim
    /// </summary>
    public virtual ICollection<MitgliedZahlung> MitgliedZahlungen { get; set; } = new List<MitgliedZahlung>();

    /// <summary>
    /// Payment allocations for this claim
    /// </summary>
    public virtual ICollection<MitgliedForderungZahlung> ForderungZahlungen { get; set; } = new List<MitgliedForderungZahlung>();
}

