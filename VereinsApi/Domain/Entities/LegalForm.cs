using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Legal form entity representing different types of legal entities
/// </summary>
[Table("LegalForm")]
public class LegalForm : BaseEntity
{
    /// <summary>
    /// Full name of the legal form
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name or abbreviation
    /// </summary>
    [MaxLength(20)]
    public string? ShortName { get; set; }

    /// <summary>
    /// Description of the legal form
    /// </summary>
    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    /// <summary>
    /// Associations using this legal form
    /// </summary>
    public virtual ICollection<Association> Associations { get; set; } = new List<Association>();
}
