using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Association (Verein) entity representing an organization/association
/// </summary>
[Table("Association", Schema = "Verein")]
public class Association : BaseEntity
{
    /// <summary>
    /// Full name of the association
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name or abbreviation of the association
    /// </summary>
    [MaxLength(50)]
    public string? ShortName { get; set; }

    /// <summary>
    /// Official association registration number
    /// </summary>
    [MaxLength(30)]
    public string? AssociationNumber { get; set; }

    /// <summary>
    /// Tax identification number
    /// </summary>
    [MaxLength(30)]
    public string? TaxNumber { get; set; }

    /// <summary>
    /// Legal form identifier (foreign key to LegalForm table)
    /// </summary>
    public int? LegalFormId { get; set; }

    /// <summary>
    /// Date when the association was founded
    /// </summary>
    [Column(TypeName = "date")]
    public DateTime? FoundingDate { get; set; }

    /// <summary>
    /// Purpose or mission statement of the association
    /// </summary>
    [MaxLength(500)]
    public string? Purpose { get; set; }

    /// <summary>
    /// Main address identifier (foreign key to Address table)
    /// </summary>
    public int? MainAddressId { get; set; }

    /// <summary>
    /// Main bank account identifier (foreign key to BankAccount table)
    /// </summary>
    public int? MainBankAccountId { get; set; }

    /// <summary>
    /// Primary phone number
    /// </summary>
    [MaxLength(30)]
    public string? Phone { get; set; }

    /// <summary>
    /// Fax number
    /// </summary>
    [MaxLength(30)]
    public string? Fax { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    [MaxLength(200)]
    [Url]
    public string? Website { get; set; }

    /// <summary>
    /// Social media links (JSON or comma-separated)
    /// </summary>
    [MaxLength(500)]
    public string? SocialMediaLinks { get; set; }

    /// <summary>
    /// Name of the current chairman/president
    /// </summary>
    [MaxLength(100)]
    public string? ChairmanName { get; set; }

    /// <summary>
    /// Name of the current manager
    /// </summary>
    [MaxLength(100)]
    public string? ManagerName { get; set; }

    /// <summary>
    /// Email address of the representative
    /// </summary>
    [MaxLength(100)]
    [EmailAddress]
    public string? RepresentativeEmail { get; set; }

    /// <summary>
    /// Name of the primary contact person
    /// </summary>
    [MaxLength(100)]
    public string? ContactPersonName { get; set; }

    /// <summary>
    /// Current number of members
    /// </summary>
    public int? MemberCount { get; set; }

    /// <summary>
    /// File path to the association's statute document
    /// </summary>
    [MaxLength(200)]
    public string? StatutePath { get; set; }

    /// <summary>
    /// File path to the association's logo
    /// </summary>
    [MaxLength(200)]
    public string? LogoPath { get; set; }

    /// <summary>
    /// External reference identifier for integration purposes
    /// </summary>
    [MaxLength(50)]
    public string? ExternalReferenceId { get; set; }

    /// <summary>
    /// Client code for system identification
    /// </summary>
    [MaxLength(50)]
    public string? ClientCode { get; set; }

    /// <summary>
    /// Electronic post receive address
    /// </summary>
    [MaxLength(100)]
    public string? EPostReceiveAddress { get; set; }

    /// <summary>
    /// SEPA creditor identifier for direct debit
    /// </summary>
    [MaxLength(50)]
    public string? SEPACreditorId { get; set; }

    /// <summary>
    /// VAT number for tax purposes
    /// </summary>
    [MaxLength(30)]
    public string? VATNumber { get; set; }

    /// <summary>
    /// Electronic signature key for digital documents
    /// </summary>
    [MaxLength(100)]
    public string? ElectronicSignatureKey { get; set; }

    // Navigation properties
    /// <summary>
    /// Legal form of the association
    /// </summary>
    public virtual LegalForm? LegalForm { get; set; }

    /// <summary>
    /// Main address of the association
    /// </summary>
    public virtual Address? MainAddress { get; set; }

    /// <summary>
    /// Main bank account of the association
    /// </summary>
    public virtual BankAccount? MainBankAccount { get; set; }

    /// <summary>
    /// Association members (many-to-many relationship)
    /// </summary>
    public virtual ICollection<AssociationMember> AssociationMembers { get; set; } = new List<AssociationMember>();
}
