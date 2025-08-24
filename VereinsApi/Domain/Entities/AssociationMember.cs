using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Junction entity representing the relationship between associations and members
/// </summary>
[Table("AssociationMember")]
public class AssociationMember : BaseEntity
{
    /// <summary>
    /// Association identifier (foreign key)
    /// </summary>
    [Required]
    public int AssociationId { get; set; }

    /// <summary>
    /// Member identifier (foreign key)
    /// </summary>
    [Required]
    public int MemberId { get; set; }

    /// <summary>
    /// Role of the member in the association (Member, Chairman, Treasurer, Secretary, etc.)
    /// </summary>
    [MaxLength(50)]
    public string? Role { get; set; }

    /// <summary>
    /// Date when the member joined this association
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? JoinDate { get; set; }

    /// <summary>
    /// Date when the member left this association
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? LeaveDate { get; set; }

    // Navigation properties
    /// <summary>
    /// Associated association
    /// </summary>
    public virtual Association Association { get; set; } = null!;

    /// <summary>
    /// Associated member
    /// </summary>
    public virtual Member Member { get; set; } = null!;
}
