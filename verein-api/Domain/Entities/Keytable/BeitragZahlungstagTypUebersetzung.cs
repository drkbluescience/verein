using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Translation for BeitragZahlungstagTyp (Contribution Payment Day Type) lookup table
/// </summary>
[Table("BeitragZahlungstagTypUebersetzung", Schema = "Keytable")]
public class BeitragZahlungstagTypUebersetzung
{
    /// <summary>
    /// Foreign key to BeitragZahlungstagTyp table (Code)
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

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
    [MaxLength(30)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Composite primary key: Code + Sprache
    /// </summary>
    [Key]
    public string Id => $"{Code}_{Sprache}";

    /// <summary>
    /// Navigation property to BeitragZahlungstagTyp
    /// </summary>
    public virtual BeitragZahlungstagTyp? BeitragZahlungstagTyp { get; set; }
}

