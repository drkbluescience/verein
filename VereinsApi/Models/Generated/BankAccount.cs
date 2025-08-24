using System;
using System.Collections.Generic;

namespace VereinsApi.Models.Generated;

public partial class BankAccount
{
    public int Id { get; set; }

    public string? BankName { get; set; }

    public string? Iban { get; set; }

    public string? Bic { get; set; }

    public string? AccountHolder { get; set; }

    public string? AccountType { get; set; }

    public int IsActive { get; set; }

    public DateTime Created { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ModifiedBy { get; set; }

    public int IsDeleted { get; set; }

    public virtual ICollection<Association> Associations { get; set; } = new List<Association>();
}
