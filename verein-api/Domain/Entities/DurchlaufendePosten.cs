using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// DurchlaufendePosten entity representing transit/pass-through items.
/// Used to track donations collected on behalf of other organizations (e.g., DITIB).
/// These are not the association's own income/expenses - they are collected and forwarded.
/// </summary>
[Table("DurchlaufendePosten", Schema = "Finanz")]
public class DurchlaufendePosten : AuditableEntity
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Account number reference (9091, 9092, 9093, etc.)
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string FiBuNummer { get; set; } = string.Empty;

    /// <summary>
    /// Description (e.g., "Deprem Yardımı - DITIB Köln")
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Date when the amount was collected (incoming)
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime EinnahmenDatum { get; set; }

    /// <summary>
    /// Amount collected
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal EinnahmenBetrag { get; set; }

    /// <summary>
    /// Date when the amount was transferred (outgoing)
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? AusgabenDatum { get; set; }

    /// <summary>
    /// Amount transferred
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? AusgabenBetrag { get; set; }

    /// <summary>
    /// Recipient organization
    /// </summary>
    [MaxLength(200)]
    public string? Empfaenger { get; set; }

    /// <summary>
    /// Transfer reference number
    /// </summary>
    [MaxLength(100)]
    public string? Referenz { get; set; }

    /// <summary>
    /// Status: OFFEN (open), TEILWEISE (partial), ABGESCHLOSSEN (closed)
    /// </summary>
    [MaxLength(20)]
    public string Status { get; set; } = "OFFEN";

    /// <summary>
    /// Link to incoming Kassenbuch entry
    /// </summary>
    public int? KassenbuchEinnahmeId { get; set; }

    /// <summary>
    /// Link to outgoing Kassenbuch entry
    /// </summary>
    public int? KassenbuchAusgabeId { get; set; }

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
    /// Related FiBu account
    /// </summary>
    public virtual FiBuKonto? FiBuKonto { get; set; }

    /// <summary>
    /// Incoming Kassenbuch entry
    /// </summary>
    public virtual Kassenbuch? KassenbuchEinnahme { get; set; }

    /// <summary>
    /// Outgoing Kassenbuch entry
    /// </summary>
    public virtual Kassenbuch? KassenbuchAusgabe { get; set; }
}

