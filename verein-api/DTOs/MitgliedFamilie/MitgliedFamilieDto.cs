using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedFamilie;

/// <summary>
/// Data Transfer Object for MitgliedFamilie entity
/// </summary>
public class MitgliedFamilieDto
{
    /// <summary>
    /// MitgliedFamilie identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Verein identifier
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Child member identifier
    /// </summary>
    [JsonPropertyName("mitgliedId")]
    public int MitgliedId { get; set; }

    /// <summary>
    /// Parent member identifier
    /// </summary>
    [JsonPropertyName("parentMitgliedId")]
    public int ParentMitgliedId { get; set; }

    /// <summary>
    /// Family relationship type identifier
    /// </summary>
    [JsonPropertyName("familienbeziehungTypId")]
    public int FamilienbeziehungTypId { get; set; }

    /// <summary>
    /// Family relationship status identifier
    /// </summary>
    [JsonPropertyName("mitgliedFamilieStatusId")]
    public int MitgliedFamilieStatusId { get; set; }

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
    [JsonPropertyName("hinweis")]
    public string? Hinweis { get; set; }

    /// <summary>
    /// Is the family relationship currently active
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }

    /// <summary>
    /// Creation date
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// Created by user ID
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification date
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// Modified by user ID
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }
}
