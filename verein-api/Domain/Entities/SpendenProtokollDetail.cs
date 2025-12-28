using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// SpendenProtokollDetail entity representing the denomination breakdown of a donation count.
/// Records how many of each bill/coin denomination was counted.
/// Example: 3x 100€, 6x 50€, 8x 20€, etc.
/// </summary>
[Table("SpendenProtokollDetail", Schema = "Finanz")]
public class SpendenProtokollDetail
{
    /// <summary>
    /// Primary key
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Parent protocol identifier
    /// </summary>
    [Required]
    public int SpendenProtokollId { get; set; }

    /// <summary>
    /// Denomination value (e.g., 200, 100, 50, 20, 10, 5, 2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01)
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Wert { get; set; }

    /// <summary>
    /// Count of this denomination
    /// </summary>
    [Required]
    public int Anzahl { get; set; }

    /// <summary>
    /// Subtotal for this denomination (Wert × Anzahl) - computed
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Summe { get; set; }

    // Navigation properties

    /// <summary>
    /// Parent protocol
    /// </summary>
    public virtual SpendenProtokoll? SpendenProtokoll { get; set; }
}

