using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for Forderungsart (Claim Type) lookup table
/// </summary>
[Table("ForderungsartUebersetzung", Schema = "Keytable")]
public class ForderungsartUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to Forderungsart table
    /// </summary>
    [Required]
    public int ForderungsartId { get; set; }

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
    /// Navigation property to Forderungsart
    /// </summary>
    public virtual Forderungsart? Forderungsart { get; set; }
}

