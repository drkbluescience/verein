using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// MitgliedFamilie entity representing family relationships between members
/// </summary>
[Table("MitgliedFamilie", Schema = "Mitglied")]
public class MitgliedFamilie : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Member identifier (foreign key to Mitglied table) - the child/dependent member
    /// </summary>
    [Required]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Parent member identifier (foreign key to Mitglied table) - the parent/guardian member
    /// </summary>
    [Required]
    public int ParentMitgliedId { get; set; }

    /// <summary>
    /// Family relationship type identifier (foreign key to FamilienbeziehungTyp table)
    /// </summary>
    [Required]
    public int FamilienbeziehungTypId { get; set; }

    /// <summary>
    /// Family relationship status identifier (foreign key to MitgliedFamilieStatus table)
    /// </summary>
    [Required]
    public int MitgliedFamilieStatusId { get; set; }

    /// <summary>
    /// Date from which this family relationship is valid
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigVon { get; set; }

    /// <summary>
    /// Date until which this family relationship is valid
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigBis { get; set; }

    /// <summary>
    /// Additional notes about this family relationship
    /// </summary>
    [MaxLength(250)]
    public string? Hinweis { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that this family relationship belongs to
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Member (child/dependent) in this family relationship
    /// </summary>
    public virtual Mitglied? Mitglied { get; set; }

    /// <summary>
    /// Parent member (parent/guardian) in this family relationship
    /// </summary>
    public virtual Mitglied? ParentMitglied { get; set; }
}
