using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungBild;

/// <summary>
/// Data Transfer Object for VeranstaltungBild entity
/// </summary>
public class VeranstaltungBildDto
{
    /// <summary>
    /// Image identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Event identifier
    /// </summary>
    [JsonPropertyName("veranstaltungId")]
    public int VeranstaltungId { get; set; }

    /// <summary>
    /// Image file path or URL
    /// </summary>
    [JsonPropertyName("bildPfad")]
    public string BildPfad { get; set; } = string.Empty;

    /// <summary>
    /// Sort order for displaying images
    /// </summary>
    [JsonPropertyName("reihenfolge")]
    public int Reihenfolge { get; set; }

    /// <summary>
    /// Image title or caption
    /// </summary>
    [JsonPropertyName("titel")]
    public string? Titel { get; set; }

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
