using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// UserRole entity for user role assignments (many-to-many)
/// </summary>
[Table("UserRole", Schema = "Web")]
public class UserRole : AuditableEntity
{
    /// <summary>
    /// User identifier (foreign key to User table)
    /// </summary>
    [Required]
    public int UserId { get; set; }

    /// <summary>
    /// Role type: 'admin', 'dernek', 'mitglied'
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string RoleType { get; set; } = string.Empty;

    /// <summary>
    /// Mitglied identifier (foreign key to Mitglied table, nullable)
    /// Null for admin users or non-member managers
    /// </summary>
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Verein identifier (foreign key to Verein table, nullable)
    /// Null for admin users
    /// </summary>
    public int? VereinId { get; set; }

    /// <summary>
    /// Validity start date
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime GueltigVon { get; set; } = DateTime.Now;

    /// <summary>
    /// Validity end date (null = unlimited)
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigBis { get; set; }

    /// <summary>
    /// Is role active?
    /// </summary>
    [Required]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Notes/remarks
    /// </summary>
    [MaxLength(250)]
    public string? Bemerkung { get; set; }

    /// <summary>
    /// Is this role record active?
    /// </summary>
    public new bool? Aktiv { get; set; } = true;

    // Navigation properties
    /// <summary>
    /// User that owns this role
    /// </summary>
    public virtual User? User { get; set; }

    /// <summary>
    /// Associated Mitglied (if applicable)
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }

    /// <summary>
    /// Associated Verein (if applicable)
    /// </summary>
    public virtual Verein? Verein { get; set; }
}

