using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedFamilie;

/// <summary>
/// Data Transfer Object for creating a new MitgliedFamilie
/// </summary>
public class CreateMitgliedFamilieDto : IValidatableObject
{
    /// <summary>
    /// Verein identifier
    /// </summary>
    [Required(ErrorMessage = "VereinId ist erforderlich")]
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Child member identifier
    /// </summary>
    [Required(ErrorMessage = "MitgliedId ist erforderlich")]
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Parent member identifier
    /// </summary>
    [Required(ErrorMessage = "ParentMitgliedId ist erforderlich")]
    [JsonPropertyName("parentMitgliedId")]
    public int ParentMitgliedId { get; set; }

    /// <summary>
    /// Family relationship type identifier
    /// </summary>
    [Required(ErrorMessage = "FamilienbeziehungTypId ist erforderlich")]
    [JsonPropertyName("familienbeziehungTypId")]
    public int FamilienbeziehungTypId { get; set; }

    /// <summary>
    /// Family relationship status identifier
    /// </summary>
    [JsonPropertyName("mitgliedFamilieStatusId")]
    public int MitgliedFamilieStatusId { get; set; } = 1;

    /// <summary>
    /// Valid from date
    /// </summary>
    [JsonPropertyName("gueltigVon")]
    public DateTime? GueltigVon { get; set; }

    /// <summary>
    /// Valid until date
    /// </summary>
    [JsonPropertyName("gueltigBis")]
    public DateTime? GueltigBis { get; set; }

    /// <summary>
    /// Additional notes about the family relationship
    /// </summary>
    [MaxLength(250, ErrorMessage = "Hinweis darf maximal 250 Zeichen lang sein")]
    [JsonPropertyName("hinweis")]
    public string? Hinweis { get; set; }

    /// <summary>
    /// Is the family relationship currently active
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; } = true;

    /// <summary>
    /// Custom validation to ensure MitgliedId and ParentMitgliedId are different
    /// </summary>
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (MitgliedId == ParentMitgliedId)
        {
            yield return new ValidationResult(
                "MitgliedId und ParentMitgliedId dürfen nicht identisch sein",
                new[] { nameof(MitgliedId), nameof(ParentMitgliedId) });
        }
    }
}
