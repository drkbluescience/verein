using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for AdresseTyp (Address Type) lookup table
/// </summary>
[Table("AdresseTypUebersetzung", Schema = "Keytable")]
public class AdresseTypUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to AdresseTyp table
    /// </summary>
    [Required]
    public int AdresseTypId { get; set; }

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
    /// Navigation property to AdresseTyp
    /// </summary>
    public virtual AdresseTyp? AdresseTyp { get; set; }
}

