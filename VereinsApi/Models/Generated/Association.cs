using System;
using System.Collections.Generic;

namespace VereinsApi.Models.Generated;

public partial class Association
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ShortName { get; set; }

    public string? AssociationNumber { get; set; }

    public string? TaxNumber { get; set; }

    public int? LegalFormId { get; set; }

    public DateTime? FoundingDate { get; set; }

    public string? Purpose { get; set; }

    public int? MainAddressId { get; set; }

    public int? MainBankAccountId { get; set; }

    public string? Phone { get; set; }

    public string? Fax { get; set; }

    public string? Email { get; set; }

    public string? Website { get; set; }

    public string? SocialMediaLinks { get; set; }

    public string? ChairmanName { get; set; }

    public string? ManagerName { get; set; }

    public string? RepresentativeEmail { get; set; }

    public string? ContactPersonName { get; set; }

    public int? MemberCount { get; set; }

    public string? StatutePath { get; set; }

    public string? LogoPath { get; set; }

    public string? ExternalReferenceId { get; set; }

    public string? ClientCode { get; set; }

    public string? EpostReceiveAddress { get; set; }

    public string? SepacreditorId { get; set; }

    public string? Vatnumber { get; set; }

    public string? ElectronicSignatureKey { get; set; }

    public DateTime Created { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ModifiedBy { get; set; }

    public int IsDeleted { get; set; }

    public int IsActive { get; set; }

    public virtual ICollection<AssociationMember> AssociationMembers { get; set; } = new List<AssociationMember>();

    public virtual LegalForm? LegalForm { get; set; }

    public virtual Address? MainAddress { get; set; }

    public virtual BankAccount? MainBankAccount { get; set; }
}
