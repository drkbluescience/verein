using System.ComponentModel.DataAnnotations;

namespace VereinsApi.DTOs.Association;

/// <summary>
/// Data Transfer Object for updating an existing Association
/// </summary>
public class UpdateAssociationDto
{
    /// <summary>
    /// Association identifier
    /// </summary>
    [Required(ErrorMessage = "Association ID is required")]
    public int Id { get; set; }

    /// <summary>
    /// Full name of the association
    /// </summary>
    [Required(ErrorMessage = "Association name is required")]
    [StringLength(200, ErrorMessage = "Association name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Short name or abbreviation of the association
    /// </summary>
    [StringLength(50, ErrorMessage = "Short name cannot exceed 50 characters")]
    public string? ShortName { get; set; }

    /// <summary>
    /// Official association registration number
    /// </summary>
    [StringLength(30, ErrorMessage = "Association number cannot exceed 30 characters")]
    public string? AssociationNumber { get; set; }

    /// <summary>
    /// Tax identification number
    /// </summary>
    [StringLength(30, ErrorMessage = "Tax number cannot exceed 30 characters")]
    public string? TaxNumber { get; set; }

    /// <summary>
    /// Legal form identifier
    /// </summary>
    public int? LegalFormId { get; set; }

    /// <summary>
    /// Date when the association was founded
    /// </summary>
    [DataType(DataType.Date)]
    public DateTime? FoundingDate { get; set; }

    /// <summary>
    /// Purpose or mission statement of the association
    /// </summary>
    [StringLength(500, ErrorMessage = "Purpose cannot exceed 500 characters")]
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
    [StringLength(30, ErrorMessage = "Phone number cannot exceed 30 characters")]
    [Phone(ErrorMessage = "Invalid phone number format")]
    public string? Phone { get; set; }

    /// <summary>
    /// Fax number
    /// </summary>
    [StringLength(30, ErrorMessage = "Fax number cannot exceed 30 characters")]
    public string? Fax { get; set; }

    /// <summary>
    /// Primary email address
    /// </summary>
    [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }

    /// <summary>
    /// Website URL
    /// </summary>
    [StringLength(200, ErrorMessage = "Website URL cannot exceed 200 characters")]
    [Url(ErrorMessage = "Invalid website URL format")]
    public string? Website { get; set; }

    /// <summary>
    /// Social media links
    /// </summary>
    [StringLength(500, ErrorMessage = "Social media links cannot exceed 500 characters")]
    public string? SocialMediaLinks { get; set; }

    /// <summary>
    /// Name of the current chairman/president
    /// </summary>
    [StringLength(100, ErrorMessage = "Chairman name cannot exceed 100 characters")]
    public string? ChairmanName { get; set; }

    /// <summary>
    /// Name of the current manager
    /// </summary>
    [StringLength(100, ErrorMessage = "Manager name cannot exceed 100 characters")]
    public string? ManagerName { get; set; }

    /// <summary>
    /// Email address of the representative
    /// </summary>
    [StringLength(100, ErrorMessage = "Representative email cannot exceed 100 characters")]
    [EmailAddress(ErrorMessage = "Invalid representative email format")]
    public string? RepresentativeEmail { get; set; }

    /// <summary>
    /// Name of the primary contact person
    /// </summary>
    [StringLength(100, ErrorMessage = "Contact person name cannot exceed 100 characters")]
    public string? ContactPersonName { get; set; }

    /// <summary>
    /// Current number of members
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Member count cannot be negative")]
    public int? MemberCount { get; set; }

    /// <summary>
    /// File path to the association's statute document
    /// </summary>
    [StringLength(200, ErrorMessage = "Statute path cannot exceed 200 characters")]
    public string? StatutePath { get; set; }

    /// <summary>
    /// File path to the association's logo
    /// </summary>
    [StringLength(200, ErrorMessage = "Logo path cannot exceed 200 characters")]
    public string? LogoPath { get; set; }

    /// <summary>
    /// External reference identifier
    /// </summary>
    [StringLength(50, ErrorMessage = "External reference ID cannot exceed 50 characters")]
    public string? ExternalReferenceId { get; set; }

    /// <summary>
    /// Client code for system identification
    /// </summary>
    [StringLength(50, ErrorMessage = "Client code cannot exceed 50 characters")]
    public string? ClientCode { get; set; }

    /// <summary>
    /// Electronic post receive address
    /// </summary>
    [StringLength(100, ErrorMessage = "E-Post receive address cannot exceed 100 characters")]
    public string? EPostReceiveAddress { get; set; }

    /// <summary>
    /// SEPA creditor identifier
    /// </summary>
    [StringLength(50, ErrorMessage = "SEPA creditor ID cannot exceed 50 characters")]
    public string? SEPACreditorId { get; set; }

    /// <summary>
    /// VAT number
    /// </summary>
    [StringLength(30, ErrorMessage = "VAT number cannot exceed 30 characters")]
    public string? VATNumber { get; set; }

    /// <summary>
    /// Electronic signature key
    /// </summary>
    [StringLength(100, ErrorMessage = "Electronic signature key cannot exceed 100 characters")]
    public string? ElectronicSignatureKey { get; set; }

    /// <summary>
    /// Active status flag
    /// </summary>
    public bool IsActive { get; set; } = true;
}
