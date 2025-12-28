using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// SpendenProtokoll entity representing a donation counting protocol.
/// Used for official documentation of cash donations with witness signatures.
/// Required for legal compliance in Germany (3 signatures for cash counting).
/// </summary>
[Table("SpendenProtokoll", Schema = "Finanz")]
public class SpendenProtokoll : AuditableEntity
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Date of the donation counting
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime Datum { get; set; }

    /// <summary>
    /// Purpose of the donation (e.g., "Cuma Bağış Kutusu", "Kurban Bağışı")
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Zweck { get; set; } = string.Empty;

    /// <summary>
    /// Category of donation purpose: GENEL, KURBAN, ZEKAT, FITRE, DEPREM, CAMI, EGITIM
    /// </summary>
    [MaxLength(30)]
    public string? ZweckKategorie { get; set; }

    /// <summary>
    /// Total amount counted
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Name of the person who performed the counting
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Protokollant { get; set; } = string.Empty;

    /// <summary>
    /// First witness name
    /// </summary>
    [MaxLength(100)]
    public string? Zeuge1Name { get; set; }

    /// <summary>
    /// Whether first witness has signed
    /// </summary>
    public bool Zeuge1Unterschrift { get; set; } = false;

    /// <summary>
    /// Second witness name
    /// </summary>
    [MaxLength(100)]
    public string? Zeuge2Name { get; set; }

    /// <summary>
    /// Whether second witness has signed
    /// </summary>
    public bool Zeuge2Unterschrift { get; set; } = false;

    /// <summary>
    /// Third witness name (optional)
    /// </summary>
    [MaxLength(100)]
    public string? Zeuge3Name { get; set; }

    /// <summary>
    /// Whether third witness has signed
    /// </summary>
    public bool Zeuge3Unterschrift { get; set; } = false;

    /// <summary>
    /// Link to the Kassenbuch entry
    /// </summary>
    public int? KassenbuchId { get; set; }

    /// <summary>
    /// Additional notes
    /// </summary>
    [MaxLength(500)]
    public string? Bemerkung { get; set; }

    // Navigation properties

    /// <summary>
    /// Related association
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Related Kassenbuch entry
    /// </summary>
    public virtual Kassenbuch? Kassenbuch { get; set; }

    /// <summary>
    /// Counting details (denomination breakdown)
    /// </summary>
    public virtual ICollection<SpendenProtokollDetail> Details { get; set; } = new List<SpendenProtokollDetail>();
}

