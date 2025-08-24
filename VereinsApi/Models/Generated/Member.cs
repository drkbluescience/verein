using System;
using System.Collections.Generic;

namespace VereinsApi.Models.Generated;

public partial class Member
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? MemberNumber { get; set; }

    public DateTime? JoinDate { get; set; }

    public string? MembershipType { get; set; }

    public string? Status { get; set; }

    public int? AddressId { get; set; }

    public int IsActive { get; set; }

    public DateTime Created { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ModifiedBy { get; set; }

    public int IsDeleted { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<AssociationMember> AssociationMembers { get; set; } = new List<AssociationMember>();
}
