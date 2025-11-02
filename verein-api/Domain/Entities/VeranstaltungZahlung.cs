using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// VeranstaltungZahlung entity representing event registration payments
/// </summary>
[Table("VeranstaltungZahlung", Schema = "Finanz")]
public class VeranstaltungZahlung : AuditableEntity
{
    /// <summary>
    /// Event identifier (foreign key to Veranstaltung table)
    /// </summary>
    [Required]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Registration identifier (foreign key to VeranstaltungAnmeldung table)
    /// </summary>
    [Required]
    public int AnmeldungId { get; set; }

    /// <summary>
    /// Name of the person making the payment
    /// </summary>
    [MaxLength(100)]
    public string? Name { get; set; }

    /// <summary>
    /// Email of the person making the payment
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

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
    /// Payment method (e.g., Cash, Bank Transfer, Credit Card, etc.)
    /// </summary>
    [MaxLength(30)]
    public string? Zahlungsweg { get; set; }

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

    // Navigation properties
    /// <summary>
    /// Event this payment is for
    /// </summary>
    public virtual Veranstaltung? Veranstaltung { get; set; }

    /// <summary>
    /// Registration this payment is for
    /// </summary>
    public virtual VeranstaltungAnmeldung? Anmeldung { get; set; }
}

