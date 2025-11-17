using System.Text.Json.Serialization;
using VereinsApi.Domain.Enums;

namespace VereinsApi.DTOs.PageNote;

/// <summary>
/// Data Transfer Object for PageNote
/// </summary>
public class PageNoteDto
{
    /// <summary>
    /// Note identifier
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// URL of the page where the note was created
    /// </summary>
    [JsonPropertyName("pageUrl")]
    public string PageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Title of the page where the note was created
    /// </summary>
    [JsonPropertyName("pageTitle")]
    public string? PageTitle { get; set; }

    /// <summary>
    /// Type of entity (Verein, Mitglied, Veranstaltung, Dashboard, etc.)
    /// </summary>
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
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Content of the note
    /// </summary>
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Category of the note
    /// </summary>
    [JsonPropertyName("category")]
    public PageNoteCategory Category { get; set; }

    /// <summary>
    /// Priority level of the note
    /// </summary>
    [JsonPropertyName("priority")]
    public PageNotePriority Priority { get; set; }

    /// <summary>
    /// Email of the user who created the note
    /// </summary>
    [JsonPropertyName("userEmail")]
    public string UserEmail { get; set; } = string.Empty;

    /// <summary>
    /// Name of the user who created the note
    /// </summary>
    [JsonPropertyName("userName")]
    public string? UserName { get; set; }

    /// <summary>
    /// Type of user who created the note (admin, dernek, mitglied)
    /// </summary>
    [JsonPropertyName("userType")]
    public string? UserType { get; set; }

    /// <summary>
    /// Status of the note
    /// </summary>
    [JsonPropertyName("status")]
    public PageNoteStatus Status { get; set; }

    /// <summary>
    /// Email of the admin who completed the note
    /// </summary>
    [JsonPropertyName("completedBy")]
    public string? CompletedBy { get; set; }

    /// <summary>
    /// Timestamp when the note was completed
    /// </summary>
    [JsonPropertyName("completedAt")]
    public DateTime? CompletedAt { get; set; }

    /// <summary>
    /// Admin's notes or comments
    /// </summary>
    [JsonPropertyName("adminNotes")]
    public string? AdminNotes { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }

    /// <summary>
    /// ID of the user who created this note
    /// </summary>
    [JsonPropertyName("createdBy")]
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Last modification timestamp
    /// </summary>
    [JsonPropertyName("modified")]
    public DateTime? Modified { get; set; }

    /// <summary>
    /// ID of the user who last modified this note
    /// </summary>
    [JsonPropertyName("modifiedBy")]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Soft delete flag
    /// </summary>
    [JsonPropertyName("deletedFlag")]
    public bool? DeletedFlag { get; set; }

    /// <summary>
    /// Active flag
    /// </summary>
    [JsonPropertyName("aktiv")]
    public bool? Aktiv { get; set; }
}

