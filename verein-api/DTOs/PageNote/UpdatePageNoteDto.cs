using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VereinsApi.Domain.Enums;

namespace VereinsApi.DTOs.PageNote;

/// <summary>
/// Data Transfer Object for updating an existing PageNote
/// </summary>
public class UpdatePageNoteDto
{
    /// <summary>
    /// Title of the note
    /// </summary>
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    /// <summary>
    /// Content of the note
    /// </summary>
    [JsonPropertyName("content")]
    public string? Content { get; set; }

    /// <summary>
    /// Category of the note
    /// </summary>
    [JsonPropertyName("category")]
    public PageNoteCategory? Category { get; set; }

    /// <summary>
    /// Priority level of the note
    /// </summary>
    [JsonPropertyName("priority")]
    public PageNotePriority? Priority { get; set; }
}

