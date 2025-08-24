using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Bank account entity representing banking information
/// </summary>
[Table("BankAccount")]
public class BankAccount : BaseEntity
{
    /// <summary>
    /// Name of the bank
    /// </summary>
    [MaxLength(200)]
    public string? BankName { get; set; }

    /// <summary>
    /// International Bank Account Number
    /// </summary>
    [MaxLength(34)]
    public string? IBAN { get; set; }

    /// <summary>
    /// Bank Identifier Code
    /// </summary>
    [MaxLength(11)]
    public string? BIC { get; set; }

    /// <summary>
    /// Name of the account holder
    /// </summary>
    [MaxLength(200)]
    public string? AccountHolder { get; set; }

    /// <summary>
    /// Type of account (Main, Secondary, etc.)
    /// </summary>
    [MaxLength(50)]
    public string? AccountType { get; set; }

    // Navigation properties
    /// <summary>
    /// Associations using this as main bank account
    /// </summary>
    public virtual ICollection<Association> AssociationsAsMainBankAccount { get; set; } = new List<Association>();
}
