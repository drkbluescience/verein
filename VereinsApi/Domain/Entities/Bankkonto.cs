using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Bankkonto entity representing banking information
/// </summary>
[Table("Bankkonto")]
public class Bankkonto : AuditableEntity
{
    /// <summary>
    /// Verein identifier (foreign key to Verein table)
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Account type identifier (foreign key to AccountType table)
    /// </summary>
    public int? KontotypId { get; set; }

    /// <summary>
    /// International Bank Account Number
    /// </summary>
    [Required]
    [MaxLength(34)]
    public string IBAN { get; set; } = string.Empty;

    /// <summary>
    /// Bank Identifier Code
    /// </summary>
    [MaxLength(20)]
    public string? BIC { get; set; }

    /// <summary>
    /// Name of the account holder
    /// </summary>
    [MaxLength(100)]
    public string? Kontoinhaber { get; set; }

    /// <summary>
    /// Name of the bank
    /// </summary>
    [MaxLength(100)]
    public string? Bankname { get; set; }

    /// <summary>
    /// Account number (legacy field for older systems)
    /// </summary>
    [MaxLength(30)]
    public string? KontoNr { get; set; }

    /// <summary>
    /// Bank code (legacy field for older systems)
    /// </summary>
    [MaxLength(15)]
    public string? BLZ { get; set; }

    /// <summary>
    /// Description or notes about this bank account
    /// </summary>
    [MaxLength(250)]
    public string? Beschreibung { get; set; }

    /// <summary>
    /// Date from which this bank account is valid
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigVon { get; set; }

    /// <summary>
    /// Date until which this bank account is valid
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? GueltigBis { get; set; }

    /// <summary>
    /// Indicates if this is the default bank account for the verein
    /// </summary>
    public bool? IstStandard { get; set; }

    // Navigation properties
    /// <summary>
    /// Verein that owns this bank account
    /// </summary>
    public virtual Verein? Verein { get; set; }

    /// <summary>
    /// Vereine using this as main bank account
    /// </summary>
    public virtual ICollection<Verein> VereineAsMainBankAccount { get; set; } = new List<Verein>();
}
