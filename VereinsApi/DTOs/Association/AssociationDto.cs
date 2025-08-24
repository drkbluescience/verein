namespace VereinsApi.DTOs.Association;

/// <summary>
/// Data Transfer Object for Association entity
/// </summary>
public class AssociationDto
{
    /// <summary>
    /// Association identifier
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Full name of the association
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name or abbreviation of the association
    /// </summary>
    public string? ShortName { get; set; }

    /// <summary>
    /// Official association registration number
    /// </summary>
    public string? AssociationNumber { get; set; }

    /// <summary>
    /// Tax identification number
    /// </summary>
    public string? TaxNumber { get; set; }

    /// <summary>
    /// Legal form identifier
    /// </summary>
    public int? LegalFormId { get; set; }

    /// <summary>
    /// Date when the association was founded
    /// </summary>
    public DateTime? FoundingDate { get; set; }

    /// <summary>
    /// Purpose or mission statement of the association
    /// </summary>
    public string? Purpose { get; set; }

    /// <summary>
    /// Main address identifier
    /// </summary>
    public int? MainAddressId { get; set; }

    /// <summary>
    /// Main bank account identifier
    /// </summary>
    public int? MainBankAccountId { get; set; }

    /// <summary>
    /// Primary phone number
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Fax number
    /// </summary>
    public string? Fax { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// Social media links
    /// </summary>
    public string? SocialMediaLinks { get; set; }

    /// <summary>
    /// Name of the current chairman/president
    /// </summary>
    public string? ChairmanName { get; set; }

    /// <summary>
    /// Name of the current manager
    /// </summary>
    public string? ManagerName { get; set; }

    /// <summary>
    /// Email address of the representative
    /// </summary>
    public string? RepresentativeEmail { get; set; }

    /// <summary>
    /// Name of the primary contact person
    /// </summary>
    public string? ContactPersonName { get; set; }

    /// <summary>
    /// Current number of members
    /// </summary>
    public int? MemberCount { get; set; }

    /// <summary>
    /// File path to the association's statute document
    /// </summary>
    public string? StatutePath { get; set; }

    /// <summary>
    /// File path to the association's logo
    /// </summary>
    public string? LogoPath { get; set; }

    /// <summary>
    /// External reference identifier
    /// </summary>
    public string? ExternalReferenceId { get; set; }

    /// <summary>
    /// Client code for system identification
    /// </summary>
    public string? ClientCode { get; set; }

    /// <summary>
    /// Electronic post receive address
    /// </summary>
    public string? EPostReceiveAddress { get; set; }

    /// <summary>
    /// SEPA creditor identifier
    /// </summary>
    public string? SEPACreditorId { get; set; }

    /// <summary>
    /// VAT number
    /// </summary>
    public string? VATNumber { get; set; }

    /// <summary>
    /// Electronic signature key
    /// </summary>
    public string? ElectronicSignatureKey { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    public DateTime Created { get; set; }

    /// <summary>
    /// ID of the user who created this entity
    /// </summary>
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification timestamp
    /// </summary>
    public DateTime? Modified { get; set; }

    /// <summary>
    /// ID of the user who last modified this entity
    /// </summary>
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Active status flag
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    public bool IsDeleted { get; set; }
}
