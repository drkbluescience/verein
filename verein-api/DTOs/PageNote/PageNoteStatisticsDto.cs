using VereinsApi.Domain.Enums;

namespace VereinsApi.DTOs.PageNote;

/// <summary>
/// DTO for page note statistics
/// </summary>
public class PageNoteStatisticsDto
{
    /// <summary>
    /// Total number of notes
    /// </summary>
    public int TotalNotes { get; set; }

    /// <summary>
    /// Number of pending notes
    /// </summary>
    public int PendingNotes { get; set; }

    /// <summary>
    /// Number of in-progress notes
    /// </summary>
    public int InProgressNotes { get; set; }

    /// <summary>
    /// Number of completed notes
    /// </summary>
    public int CompletedNotes { get; set; }

    /// <summary>
    /// Number of rejected notes
    /// </summary>
    public int RejectedNotes { get; set; }

    /// <summary>
    /// Notes count by category
    /// </summary>
    public Dictionary<PageNoteCategory, int> NotesByCategory { get; set; } = new();

    /// <summary>
    /// Notes count by priority
    /// </summary>
    public Dictionary<PageNotePriority, int> NotesByPriority { get; set; } = new();

    /// <summary>
    /// Notes count by user
    /// </summary>
    public List<UserNoteCount> NotesByUser { get; set; } = new();

    /// <summary>
    /// Recent notes (last 10)
    /// </summary>
    public List<PageNoteDto> RecentNotes { get; set; } = new();
}

/// <summary>
/// User note count
/// </summary>
public class UserNoteCount
{
    /// <summary>
    /// User email
    /// </summary>
    public string UserEmail { get; set; } = string.Empty;

    /// <summary>
    /// User name
    /// </summary>
    public string? UserName { get; set; }

    /// <summary>
    /// Number of notes
    /// </summary>
    public int Count { get; set; }
}

