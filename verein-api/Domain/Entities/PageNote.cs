using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VereinsApi.Domain.Enums;

namespace VereinsApi.Domain.Entities;

/// <summary>
/// PageNote entity representing user notes on pages for development feedback
/// </summary>
[Table("PageNote", Schema = "Web")]
public class PageNote : AuditableEntity
{
    /// <summary>
    /// URL of the page where the note was created
    /// </summary>
    [Required]
    [MaxLength(500)]
    public string PageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Title of the page where the note was created
    /// </summary>
    [MaxLength(200)]
    public string? PageTitle { get; set; }

    /// <summary>
    /// Type of entity (Verein, Mitglied, Veranstaltung, Dashboard, etc.)
    /// </summary>
    [MaxLength(50)]
    public string? EntityType { get; set; }

    /// <summary>
    /// ID of the related entity (optional)
    /// </summary>
    public int? EntityId { get; set; }

    /// <summary>
    /// Title of the note
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Content of the note
    /// </summary>
    [Required]
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Category of the note
    /// </summary>
    [Required]
    public PageNoteCategory Category { get; set; } = PageNoteCategory.General;

    /// <summary>
    /// Priority level of the note
    /// </summary>
    [Required]
    public PageNotePriority Priority { get; set; } = PageNotePriority.Medium;

    /// <summary>
    /// Email of the user who created the note
    /// </summary>
    [Required]
    [MaxLength(256)]
    public string UserEmail { get; set; } = string.Empty;

    /// <summary>
    /// Name of the user who created the note
    /// </summary>
    [MaxLength(200)]
    public string? UserName { get; set; }

    /// <summary>
    /// Type of user who created the note (admin, dernek, mitglied)
    /// </summary>
    [MaxLength(50)]
    public string? UserType { get; set; }

    /// <summary>
    /// Status of the note
    /// </summary>
    [Required]
    public PageNoteStatus Status { get; set; } = PageNoteStatus.Pending;

    /// <summary>
    /// Email of the admin who completed the note
    /// </summary>
    [MaxLength(256)]
    public string? CompletedBy { get; set; }

    /// <summary>
    /// Timestamp when the note was completed
    /// </summary>
    public DateTime? CompletedAt { get; set; }

    /// <summary>
    /// Admin's notes or comments
    /// </summary>
    public string? AdminNotes { get; set; }
}

