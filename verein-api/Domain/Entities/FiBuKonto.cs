using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// FiBuKonto entity representing the chart of accounts (Kontenplan) for financial bookkeeping.
/// Based on SKR-49 standard for German non-profit organizations.
/// </summary>
[Table("FiBuKonto", Schema = "Finanz")]
public class FiBuKonto : AuditableEntity
{
    /// <summary>
    /// Account number (e.g., "2110", "3220", "GTU")
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string Nummer { get; set; } = string.Empty;

    /// <summary>
    /// Account description in German
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Bezeichnung { get; set; } = string.Empty;

    /// <summary>
    /// Account description in Turkish (optional)
    /// </summary>
    [MaxLength(200)]
    public string? BezeichnungTR { get; set; }

    /// <summary>
    /// Account area: KASSE (Cash), BANK (Bank), KASSE_BANK (Both)
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Bereich { get; set; } = string.Empty;

    /// <summary>
    /// Account type: EINNAHMEN (Income), AUSGABEN (Expense), EIN_AUSG (Both)
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Typ { get; set; } = string.Empty;

    /// <summary>
    /// Main business area code: A, B, C, D (nullable for transit accounts)
    /// A = Ideeller Bereich (Charitable activities)
    /// B = Vermögensverwaltung (Asset management)
    /// C = Zweckbetrieb (Purpose-related business)
    /// D = Geschäftsbetrieb (Commercial business)
    /// </summary>
    [MaxLength(1)]
    public string? Hauptbereich { get; set; }

    /// <summary>
    /// Main business area name (for display purposes)
    /// </summary>
    [MaxLength(50)]
    public string? HauptbereichName { get; set; }

    /// <summary>
    /// Optional link to existing ZahlungTyp for integration with member payments
    /// </summary>
    public int? ZahlungTypId { get; set; }

    /// <summary>
    /// Sort order for display
    /// </summary>
    public int Reihenfolge { get; set; } = 0;

    /// <summary>
    /// Whether this account is active
    /// </summary>
    public bool IsAktiv { get; set; } = true;

    // Navigation properties

    /// <summary>
    /// Related ZahlungTyp (if linked to member payment types)
    /// </summary>
    public virtual ZahlungTyp? ZahlungTyp { get; set; }

    /// <summary>
    /// Kassenbuch entries using this account
    /// </summary>
    public virtual ICollection<Kassenbuch> Kassenbuchungen { get; set; } = new List<Kassenbuch>();

    /// <summary>
    /// Transit items using this account
    /// </summary>
    public virtual ICollection<DurchlaufendePosten> DurchlaufendePosten { get; set; } = new List<DurchlaufendePosten>();
}

