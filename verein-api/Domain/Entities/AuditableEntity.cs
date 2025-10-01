using System.ComponentModel.DataAnnotations;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Auditable entity class that provides common audit and lifecycle properties for all entities
/// </summary>
public abstract class AuditableEntity
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    public DateTime? Created { get; set; }

    /// <summary>
    /// ID of the user who created this entity
    /// </summary>
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification timestamp
    /// </summary>
    public DateTime? Modified { get; set; }

    /// <summary>
    /// ID of the user who last modified this entity
    /// </summary>
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    public bool? DeletedFlag { get; set; }

    /// <summary>
    /// Active status flag
    /// </summary>
    public bool? Aktiv { get; set; }
}
