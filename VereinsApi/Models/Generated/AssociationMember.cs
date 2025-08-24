using System;
using System.Collections.Generic;

namespace VereinsApi.Models.Generated;

public partial class AssociationMember
{
    public int Id { get; set; }

    public int AssociationId { get; set; }

    public int MemberId { get; set; }

    public string? Role { get; set; }

    public DateTime? JoinDate { get; set; }

    public DateTime? LeaveDate { get; set; }

    public int IsActive { get; set; }

    public DateTime Created { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ModifiedBy { get; set; }

    public int IsDeleted { get; set; }

    public virtual Association Association { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
