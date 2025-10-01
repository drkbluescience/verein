using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.VeranstaltungBild;

/// <summary>
/// Data Transfer Object for updating an existing VeranstaltungBild
/// </summary>
public class UpdateVeranstaltungBildDto
{
    /// <summary>
    /// Image file path or URL
    /// </summary>
    [StringLength(500, ErrorMessage = "Image path cannot exceed 500 characters")]
    [JsonPropertyName("bildPfad")]
    public string? BildPfad { get; set; }

    /// <summary>
    /// Sort order for displaying images
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Sort order must be at least 1")]
    [JsonPropertyName("reihenfolge")]
    public int? Reihenfolge { get; set; }

    /// <summary>
    /// Image title or caption
    /// </summary>
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    [JsonPropertyName("titel")]
    public string? Titel { get; set; }
}
