using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for MitgliedFamilieStatus (Family Member Status) lookup table
/// </summary>
[Table("MitgliedFamilieStatusUebersetzung", Schema = "Keytable")]
public class MitgliedFamilieStatusUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to MitgliedFamilieStatus table
    /// </summary>
    [Required]
    public int MitgliedFamilieStatusId { get; set; }

    /// <summary>
    /// Language code (e.g., "de", "en", "tr")
    /// </summary>
    [Required]
    [MaxLength(2)]
    public string Sprache { get; set; } = string.Empty;

    /// <summary>
    /// Translated name
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Navigation property to MitgliedFamilieStatus
    /// </summary>
    public virtual MitgliedFamilieStatus? MitgliedFamilieStatus { get; set; }
}

