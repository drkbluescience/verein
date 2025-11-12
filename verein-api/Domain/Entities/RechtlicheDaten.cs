using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// RechtlicheDaten entity representing legal and official information for a Verein
/// </summary>
[Table("RechtlicheDaten", Schema = "Verein")]
public class RechtlicheDaten : AuditableEntity
{
    /// <summary>
    /// Foreign key to Verein
    /// </summary>
    [Required]
    public int VereinId { get; set; }

    /// <summary>
    /// Navigation property to Verein
    /// </summary>
    [ForeignKey("VereinId")]
    public virtual Verein? Verein { get; set; }

    // =============================================
    // Registergericht (Court Registration)
    // =============================================

    /// <summary>
    /// Name of the registration court (e.g., "Amtsgericht München")
    /// </summary>
    [MaxLength(200)]
    public string? RegistergerichtName { get; set; }

    /// <summary>
    /// Court registration number (e.g., "VR 12345")
    /// </summary>
    [MaxLength(50)]
    public string? RegistergerichtNummer { get; set; }

    /// <summary>
    /// City of the registration court
    /// </summary>
    [MaxLength(100)]
    public string? RegistergerichtOrt { get; set; }

    /// <summary>
    /// Date of court registration
    /// </summary>
    public DateTime? RegistergerichtEintragungsdatum { get; set; }

    // =============================================
    // Finanzamt (Tax Office)
    // =============================================

    /// <summary>
    /// Name of the tax office (e.g., "Finanzamt München")
    /// </summary>
    [MaxLength(200)]
    public string? FinanzamtName { get; set; }

    /// <summary>
    /// Tax office number
    /// </summary>
    [MaxLength(50)]
    public string? FinanzamtNummer { get; set; }

    /// <summary>
    /// City of the tax office
    /// </summary>
    [MaxLength(100)]
    public string? FinanzamtOrt { get; set; }

    // =============================================
    // Tax Status
    // =============================================

    /// <summary>
    /// Is the Verein subject to taxation
    /// </summary>
    public bool? Steuerpflichtig { get; set; }

    /// <summary>
    /// Is the Verein tax-exempt
    /// </summary>
    public bool? Steuerbefreit { get; set; }

    /// <summary>
    /// Is the Verein recognized as public benefit (Gemeinnützigkeit)
    /// </summary>
    public bool? GemeinnuetzigAnerkannt { get; set; }

    /// <summary>
    /// Public benefit status valid until this date
    /// </summary>
    public DateTime? GemeinnuetzigkeitBis { get; set; }

    // =============================================
    // Document Paths
    // =============================================

    /// <summary>
    /// Path to tax declaration document
    /// </summary>
    [MaxLength(500)]
    public string? SteuererklaerungPfad { get; set; }

    /// <summary>
    /// Year of the tax declaration
    /// </summary>
    public int? SteuererklaerungJahr { get; set; }

    /// <summary>
    /// Path to tax exemption document
    /// </summary>
    [MaxLength(500)]
    public string? SteuerbefreiungPfad { get; set; }

    /// <summary>
    /// Path to public benefit certificate (Gemeinnützigkeitsbescheid)
    /// </summary>
    [MaxLength(500)]
    public string? GemeinnuetzigkeitsbescheidPfad { get; set; }

    /// <summary>
    /// Path to court registration extract (Registerauszug)
    /// </summary>
    [MaxLength(500)]
    public string? RegisterauszugPfad { get; set; }

    // =============================================
    // Notes
    // =============================================

    /// <summary>
    /// Additional notes or remarks
    /// </summary>
    [MaxLength(1000)]
    public string? Bemerkung { get; set; }
}

