using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// MitgliedForderungZahlung entity representing the allocation of payments to claims (junction table)
/// </summary>
[Table("MitgliedForderungZahlung", Schema = "Finanz")]
public class MitgliedForderungZahlung : AuditableEntity
{
    /// <summary>
    /// Claim identifier (foreign key to MitgliedForderung table)
    /// </summary>
    [Required]
    public int ForderungId { get; set; }

    /// <summary>
    /// Payment identifier (foreign key to MitgliedZahlung table)
    /// </summary>
    [Required]
    public int ZahlungId { get; set; }

    /// <summary>
    /// Allocated amount from payment to claim
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Betrag { get; set; }

    // Navigation properties
    /// <summary>
    /// Claim that receives this payment allocation
    /// </summary>
    public virtual MitgliedForderung? Forderung { get; set; }

    /// <summary>
    /// Payment that is allocated to the claim
    /// </summary>
    public virtual MitgliedZahlung? Zahlung { get; set; }
}

