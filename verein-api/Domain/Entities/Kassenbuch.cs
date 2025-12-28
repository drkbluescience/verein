using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Kassenbuch entity representing the cash book (Kasa Defteri).
/// Central table for all financial transactions - both cash and bank.
/// Based on easyFiBu structure.
/// </summary>
[Table("Kassenbuch", Schema = "Finanz")]
public class Kassenbuch : AuditableEntity
{
    /// <summary>
    /// Association identifier (Verein)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Receipt/Document number - sequential within year per association
    /// </summary>
    [Required]
    public int BelegNr { get; set; }

    /// <summary>
    /// Receipt/Document date
    /// </summary>
    [Required]
    [Column(TypeName = "date")]
    public DateTime BelegDatum { get; set; }

    /// <summary>
    /// FiBu account number (FK to FiBuKonto.Nummer)
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string FiBuNummer { get; set; } = string.Empty;

    /// <summary>
    /// Purpose/Description of the transaction
    /// </summary>
    [MaxLength(500)]
    public string? Verwendungszweck { get; set; }

    /// <summary>
    /// Cash income (Kasa Gelir)
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? EinnahmeKasse { get; set; }

    /// <summary>
    /// Cash expense (Kasa Gider)
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? AusgabeKasse { get; set; }

    /// <summary>
    /// Bank income (Banka Gelir)
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? EinnahmeBank { get; set; }

    /// <summary>
    /// Bank expense (Banka Gider)
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? AusgabeBank { get; set; }

    /// <summary>
    /// Fiscal year
    /// </summary>
    [Required]
    public int Jahr { get; set; }

    /// <summary>
    /// Optional link to member (for member-related transactions)
    /// </summary>
    public int? MitgliedId { get; set; }

    /// <summary>
    /// Optional link to MitgliedZahlung (if created from member payment)
    /// </summary>
    public int? MitgliedZahlungId { get; set; }

    /// <summary>
    /// Optional link to BankBuchung (if related to bank transaction)
    /// </summary>
    public int? BankBuchungId { get; set; }

    /// <summary>
    /// Payment method: BAR, UEBERWEISUNG, LASTSCHRIFT, EC_KARTE
    /// </summary>
    [MaxLength(30)]
    public string? Zahlungsweg { get; set; }

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
    /// Related member (optional)
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }

    /// <summary>
    /// Related member payment (optional)
    /// </summary>
    public virtual MitgliedZahlung? MitgliedZahlung { get; set; }

    /// <summary>
    /// Related bank transaction (optional)
    /// </summary>
    public virtual BankBuchung? BankBuchung { get; set; }

    /// <summary>
    /// Related donation protocols
    /// </summary>
    public virtual ICollection<SpendenProtokoll> SpendenProtokolle { get; set; } = new List<SpendenProtokoll>();

    /// <summary>
    /// Transit items where this is the incoming entry
    /// </summary>
    public virtual ICollection<DurchlaufendePosten> DurchlaufendePostenEinnahmen { get; set; } = new List<DurchlaufendePosten>();

    /// <summary>
    /// Transit items where this is the outgoing entry
    /// </summary>
    public virtual ICollection<DurchlaufendePosten> DurchlaufendePostenAusgaben { get; set; } = new List<DurchlaufendePosten>();
}

