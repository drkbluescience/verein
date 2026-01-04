using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Organization entity representing hierarchical organizational units
/// </summary>
[Table("Organization")]
public class Organization : AuditableEntity
{
    /// <summary>
    /// Display name of the organization unit
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Organization type (Landesverband, Region, Verein)
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string OrgType { get; set; } = string.Empty;

    /// <summary>
    /// Parent organization identifier (self-referencing FK)
    /// </summary>
    public int? ParentOrganizationId { get; set; }

    /// <summary>
    /// Federation code (DITIB)
    /// </summary>
    [MaxLength(20)]
    public string? FederationCode { get; set; }

    /// <summary>
    /// Parent organization navigation
    /// </summary>
    public virtual Organization? ParentOrganization { get; set; }

    /// <summary>
    /// Child organizations navigation
    /// </summary>
    public virtual ICollection<Organization> Children { get; set; } = new List<Organization>();
}
