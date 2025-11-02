using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for Forderungsstatus (Claim Status) lookup table
/// </summary>
[Table("ForderungsstatusUebersetzung", Schema = "Keytable")]
public class ForderungsstatusUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to Forderungsstatus table
    /// </summary>
    [Required]
    public int ForderungsstatusId { get; set; }

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
    /// Navigation property to Forderungsstatus
    /// </summary>
    public virtual Forderungsstatus? Forderungsstatus { get; set; }
}

