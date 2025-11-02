using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for ZahlungStatus (Payment Status) lookup table
/// </summary>
[Table("ZahlungStatusUebersetzung", Schema = "Keytable")]
public class ZahlungStatusUebersetzung
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to ZahlungStatus table
    /// </summary>
    [Required]
    public int ZahlungStatusId { get; set; }

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
    /// Navigation property to ZahlungStatus
    /// </summary>
    public virtual ZahlungStatus? ZahlungStatus { get; set; }
}

