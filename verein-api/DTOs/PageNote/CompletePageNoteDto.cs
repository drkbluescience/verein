using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VereinsApi.Domain.Enums;

namespace VereinsApi.DTOs.PageNote;

/// <summary>
/// Data Transfer Object for completing a PageNote (Admin only)
/// </summary>
public class CompletePageNoteDto
{
    /// <summary>
    /// New status for the note
    /// </summary>
    [Required(ErrorMessage = "Status is required")]
    [JsonPropertyName("status")]
    public PageNoteStatus Status { get; set; }

    /// <summary>
    /// Admin's notes or comments
    /// </summary>
    [JsonPropertyName("adminNotes")]
    public string? AdminNotes { get; set; }
}

