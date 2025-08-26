using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// VeranstaltungAnmeldung entity representing participant registrations for events
/// </summary>
[Table("VeranstaltungAnmeldung")]
public class VeranstaltungAnmeldung : AuditableEntity
{
    /// <summary>
    /// Event identifier (foreign key to Event table)
    /// </summary>
    [Required]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Member identifier (foreign key to Member table)
    /// </summary>
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Participant name (for non-members or override)
    /// </summary>
    [MaxLength(100)]
    public string? Name { get; set; }

    /// <summary>
    /// Participant email
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    /// <summary>
    /// Participant phone number
    /// </summary>
    [MaxLength(30)]
    public string? Telefon { get; set; }

    /// <summary>
    /// Registration status (Registered, Confirmed, Cancelled, etc.)
    /// </summary>
    [MaxLength(20)]
    public string? Status { get; set; }

    /// <summary>
    /// Additional notes for the registration
    /// </summary>
    [MaxLength(250)]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Price paid for this registration
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? Preis { get; set; }

    /// <summary>
    /// Currency identifier (foreign key to Currency table)
    /// </summary>
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Payment status identifier (foreign key to PaymentStatus table)
    /// </summary>
    public int? ZahlungStatusId { get; set; }

    // Navigation properties
    /// <summary>
    /// Event for this registration
    /// </summary>
    public virtual Veranstaltung? Veranstaltung { get; set; }
}
