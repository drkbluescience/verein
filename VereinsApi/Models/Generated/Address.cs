using System;
using System.Collections.Generic;

namespace VereinsApi.Models.Generated;

public partial class Address
{
    public int Id { get; set; }

    public string? Street { get; set; }

    public string? HouseNumber { get; set; }

    public string? PostalCode { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public string? AddressType { get; set; }

    public int IsActive { get; set; }

    public DateTime Created { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ModifiedBy { get; set; }

    public int IsDeleted { get; set; }

    public virtual ICollection<Association> Associations { get; set; } = new List<Association>();

    public virtual ICollection<Member> Members { get; set; } = new List<Member>();
}
