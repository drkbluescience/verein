using System;
using System.Collections.Generic;

namespace VereinsApi.Models.Generated;

public partial class LegalForm
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ShortName { get; set; }

    public string? Description { get; set; }

    public int IsActive { get; set; }

    public DateTime Created { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ModifiedBy { get; set; }

    public int IsDeleted { get; set; }

    public virtual ICollection<Association> Associations { get; set; } = new List<Association>();
}
