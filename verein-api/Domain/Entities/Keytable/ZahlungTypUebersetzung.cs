using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for ZahlungTyp (Payment Type) lookup table
/// </summary>
[Table("ZahlungTypUebersetzung", Schema = "Keytable")]
public class ZahlungTypUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to ZahlungTyp table
    /// </summary>
    [Required]
    public int ZahlungTypId { get; set; }

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
    /// Navigation property to ZahlungTyp
    /// </summary>
    public virtual ZahlungTyp? ZahlungTyp { get; set; }
}

