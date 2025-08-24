using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// Address entity representing physical addresses
/// </summary>
[Table("Address")]
public class Address : BaseEntity
{
    /// <summary>
    /// Street name
    /// </summary>
    [MaxLength(200)]
    public string? Street { get; set; }

    /// <summary>
    /// House number
    /// </summary>
    [MaxLength(20)]
    public string? HouseNumber { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    [MaxLength(20)]
    public string? PostalCode { get; set; }

    /// <summary>
    /// City name
    /// </summary>
    [MaxLength(100)]
    public string? City { get; set; }

    /// <summary>
    /// Country name
    /// </summary>
    [MaxLength(100)]
    public string Country { get; set; } = "Deutschland";

    /// <summary>
    /// Type of address (Main, Billing, Shipping, etc.)
    /// </summary>
    [MaxLength(50)]
    public string? AddressType { get; set; }

    // Navigation properties
    /// <summary>
    /// Members using this address
    /// </summary>
    public virtual ICollection<Member> Members { get; set; } = new List<Member>();

    /// <summary>
    /// Associations using this as main address
    /// </summary>
    public virtual ICollection<Association> AssociationsAsMainAddress { get; set; } = new List<Association>();
}
