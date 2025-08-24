using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Member entity representing an association member
/// </summary>
[Table("Member")]
public class Member : BaseEntity
{
    /// <summary>
    /// First name of the member
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Last name of the member
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Email address of the member
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    /// <summary>
    /// Phone number of the member
    /// </summary>
    [MaxLength(30)]
    public string? Phone { get; set; }

    /// <summary>
    /// Date of birth
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Unique member number
    /// </summary>
    [MaxLength(50)]
    public string? MemberNumber { get; set; }

    /// <summary>
    /// Date when the member joined
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? JoinDate { get; set; }

    /// <summary>
    /// Type of membership (Regular, Honorary, Supporting, etc.)
    /// </summary>
    [MaxLength(50)]
    public string? MembershipType { get; set; }

    /// <summary>
    /// Current status of the member (Active, Inactive, Suspended)
    /// </summary>
    [MaxLength(20)]
    public string Status { get; set; } = "Active";

    /// <summary>
    /// Address identifier (foreign key to Address table)
    /// </summary>
    public int? AddressId { get; set; }

    // Navigation properties
    /// <summary>
    /// Member's address
    /// </summary>
    public virtual Address? Address { get; set; }

    /// <summary>
    /// Association memberships
    /// </summary>
    public virtual ICollection<AssociationMember> AssociationMembers { get; set; } = new List<AssociationMember>();
}
