using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for MitgliedTyp (Member Type) lookup table
/// </summary>
[Table("MitgliedTypUebersetzung", Schema = "Keytable")]
public class MitgliedTypUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to MitgliedTyp table
    /// </summary>
    [Required]
    public int MitgliedTypId { get; set; }

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
    /// Navigation property to MitgliedTyp
    /// </summary>
    public virtual MitgliedTyp? MitgliedTyp { get; set; }
}

