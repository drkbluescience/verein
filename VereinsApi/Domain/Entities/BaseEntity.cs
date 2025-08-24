using System.ComponentModel.DataAnnotations;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Base entity class that provides common properties for all entities
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    [Required]
    public DateTime Created { get; set; } = DateTime.UtcNow;

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
    [Required]
    public bool IsDeleted { get; set; } = false;

    /// <summary>
    /// Active status flag
    /// </summary>
    [Required]
    public bool IsActive { get; set; } = true;
}
