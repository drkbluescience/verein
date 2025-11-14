using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Adresse entity representing physical addresses
/// </summary>
[Table("Adresse")]
public class Adresse : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// NOTE: This field is deprecated. Verein now uses HauptAdresse relationship instead.
    /// Kept for backward compatibility with existing data.
    /// </summary>
    [Obsolete("Use Verein.HauptAdresse relationship instead")]
    public int? VereinId { get; set; }

    /// <summary>
    /// Address type identifier (foreign key to AddressType table)
    /// </summary>
    public int? AdresseTypId { get; set; }

    /// <summary>
    /// Street name
    /// </summary>
    [MaxLength(100)]
    public string? Strasse { get; set; }

    /// <summary>
    /// House number
    /// </summary>
    [MaxLength(10)]
    public string? Hausnummer { get; set; }

    /// <summary>
    /// Additional address information (apartment, floor, etc.)
    /// </summary>
    [MaxLength(100)]
    public string? Adresszusatz { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    [MaxLength(10)]
    public string? PLZ { get; set; }

    /// <summary>
    /// City name
    /// </summary>
    [MaxLength(100)]
    public string? Ort { get; set; }

    /// <summary>
    /// District or borough
    /// </summary>
    [MaxLength(50)]
    public string? Stadtteil { get; set; }

    /// <summary>
    /// State or province
    /// </summary>
    [MaxLength(50)]
    public string? Bundesland { get; set; }

    /// <summary>
    /// Country name
    /// </summary>
    [MaxLength(50)]
    public string? Land { get; set; }

    /// <summary>
    /// Post office box number
    /// </summary>
    [MaxLength(30)]
    public string? Postfach { get; set; }

    /// <summary>
    /// Phone number for this address
    /// </summary>
    [MaxLength(30)]
    public string? Telefonnummer { get; set; }

    /// <summary>
    /// Fax number for this address
    /// </summary>
    [MaxLength(30)]
    public string? Faxnummer { get; set; }

    /// <summary>
    /// Email address for this location
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? EMail { get; set; }

    /// <summary>
    /// Contact person at this address
    /// </summary>
    [MaxLength(100)]
    public string? Kontaktperson { get; set; }

    /// <summary>
    /// Additional notes about this address
    /// </summary>
    [MaxLength(250)]
    public string? Hinweis { get; set; }

    /// <summary>
    /// Latitude coordinate for GPS location
    /// </summary>
    public double? Latitude { get; set; }

    /// <summary>
    /// Longitude coordinate for GPS location
    /// </summary>
    public double? Longitude { get; set; }

    /// <summary>
    /// Date from which this address is valid
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigVon { get; set; }

    /// <summary>
    /// Date until which this address is valid
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigBis { get; set; }

    /// <summary>
    /// Indicates if this is the default address
    /// </summary>
    public bool? IstStandard { get; set; }

    // Navigation properties
    /// <summary>
    /// Vereine using this as main address
    /// </summary>
    public virtual ICollection<Verein> VereineAsMainAddress { get; set; } = new List<Verein>();
}
