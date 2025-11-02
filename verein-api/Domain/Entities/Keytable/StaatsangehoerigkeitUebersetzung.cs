using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for Staatsangehoerigkeit (Nationality) lookup table
/// </summary>
[Table("StaatsangehoerigkeitUebersetzung", Schema = "Keytable")]
public class StaatsangehoerigkeitUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to Staatsangehoerigkeit table
    /// </summary>
    [Required]
    public int StaatsangehoerigkeitId { get; set; }

    /// <summary>
    /// Language code (e.g., "de", "en", "tr")
    /// </summary>
    [Required]
    [MaxLength(2)]
    public string Sprache { get; set; } = string.Empty;

    /// <summary>
    /// Translated country name
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Navigation property to Staatsangehoerigkeit
    /// </summary>
    public virtual Staatsangehoerigkeit? Staatsangehoerigkeit { get; set; }
}

