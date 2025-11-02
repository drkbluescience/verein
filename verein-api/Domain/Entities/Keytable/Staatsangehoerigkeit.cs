using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities.Keytable;

/// <summary>
/// Staatsangehoerigkeit (Nationality) lookup table
/// Uses ISO 2 and ISO 3 country codes
/// </summary>
[Table("Staatsangehoerigkeit", Schema = "Keytable")]
public class Staatsangehoerigkeit
{
    /// <summary>
    /// Primary key identifier
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// ISO 2 country code (e.g., "DE", "TR", "US")
    /// </summary>
    [Required]
    [MaxLength(2)]
    public string Iso2 { get; set; } = string.Empty;

    /// <summary>
    /// ISO 3 country code (e.g., "DEU", "TUR", "USA")
    /// </summary>
    [Required]
    [MaxLength(3)]
    public string Iso3 { get; set; } = string.Empty;

    /// <summary>
    /// Translations for this nationality
    /// </summary>
    public virtual ICollection<StaatsangehoerigkeitUebersetzung> Uebersetzungen { get; set; } = new List<StaatsangehoerigkeitUebersetzung>();
}

