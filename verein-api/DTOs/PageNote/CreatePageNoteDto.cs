using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VereinsApi.Domain.Enums;

namespace VereinsApi.DTOs.PageNote;

/// <summary>
/// Data Transfer Object for creating a new PageNote
/// </summary>
public class CreatePageNoteDto
{
    /// <summary>
    /// URL of the page where the note was created
    /// </summary>
    [Required(ErrorMessage = "Page URL is required")]
    [MaxLength(500, ErrorMessage = "Page URL cannot exceed 500 characters")]
    [JsonPropertyName("pageUrl")]
    public string PageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Title of the page where the note was created
    /// </summary>
    [MaxLength(200, ErrorMessage = "Page title cannot exceed 200 characters")]
    [JsonPropertyName("pageTitle")]
    public string? PageTitle { get; set; }

    /// <summary>
    /// Type of entity (Verein, Mitglied, Veranstaltung, Dashboard, etc.)
    /// </summary>
    [MaxLength(50, ErrorMessage = "Entity type cannot exceed 50 characters")]
    [JsonPropertyName("entityType")]
    public string? EntityType { get; set; }

    /// <summary>
    /// ID of the related entity (optional)
    /// </summary>
    [JsonPropertyName("entityId")]
    public int? EntityId { get; set; }

    /// <summary>
    /// Title of the note
    /// </summary>
    [Required(ErrorMessage = "Note title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Content of the note
    /// </summary>
    [Required(ErrorMessage = "Note content is required")]
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Category of the note
    /// </summary>
    [JsonPropertyName("category")]
    public PageNoteCategory Category { get; set; } = PageNoteCategory.General;

    /// <summary>
    /// Priority level of the note
    /// </summary>
    [JsonPropertyName("priority")]
    public PageNotePriority Priority { get; set; } = PageNotePriority.Medium;
}

