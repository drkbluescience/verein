using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// MitgliedVorauszahlung entity representing member advance payments
/// </summary>
[Table("MitgliedVorauszahlung", Schema = "Finanz")]
public class MitgliedVorauszahlung : AuditableEntity
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
    /// Payment identifier (foreign key to MitgliedZahlung table)
    /// </summary>
    [Required]
    public int ZahlungId { get; set; }

    /// <summary>
    /// Remaining advance payment amount
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
    /// Description of the advance payment
    /// </summary>
    [MaxLength(250)]
    public string? Beschreibung { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that owns this advance payment
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Member who made this advance payment
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }

    /// <summary>
    /// Payment that created this advance
    /// </summary>
    public virtual MitgliedZahlung? Zahlung { get; set; }
}

