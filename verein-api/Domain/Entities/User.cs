using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// User entity for authentication and authorization
/// </summary>
[Table("User", Schema = "Web")]
public class User : AuditableEntity
{
    /// <summary>
    /// Email address (unique, used for login)
    /// </summary>
    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Password hash (nullable - password system will be added later)
    /// </summary>
    [MaxLength(255)]
    public string? PasswordHash { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Vorname { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Nachname { get; set; } = string.Empty;

    /// <summary>
    /// Is user active?
    /// </summary>
    [Required]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Is email confirmed?
    /// </summary>
    [Required]
    public bool EmailConfirmed { get; set; } = false;

    /// <summary>
    /// Last login timestamp
    /// </summary>
    public DateTime? LastLogin { get; set; }

    /// <summary>
    /// Failed login attempts counter
    /// </summary>
    [Required]
    public int FailedLoginAttempts { get; set; } = 0;

    /// <summary>
    /// Account lockout end time
    /// </summary>
    public DateTime? LockoutEnd { get; set; }

    /// <summary>
    /// Is this user record active?
    /// </summary>
    public bool? Aktiv { get; set; } = true;

    // Navigation properties
    /// <summary>
    /// User roles (one-to-many relationship)
    /// </summary>
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

