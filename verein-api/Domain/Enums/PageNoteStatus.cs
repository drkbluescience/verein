namespace VereinsApi.Domain.Enums;

/// <summary>
/// Status of a page note
/// </summary>
public enum PageNoteStatus
{
    /// <summary>
    /// Note is pending review
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Note is being worked on
    /// </summary>
    InProgress = 1,

    /// <summary>
    /// Note has been completed
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Note has been rejected
    /// </summary>
    Rejected = 3
}

