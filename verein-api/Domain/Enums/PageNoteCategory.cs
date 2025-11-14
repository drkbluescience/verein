namespace VereinsApi.Domain.Enums;

/// <summary>
/// Category of a page note
/// </summary>
public enum PageNoteCategory
{
    /// <summary>
    /// General note or comment
    /// </summary>
    General = 0,

    /// <summary>
    /// Bug report
    /// </summary>
    Bug = 1,

    /// <summary>
    /// Feature request
    /// </summary>
    Feature = 2,

    /// <summary>
    /// Question
    /// </summary>
    Question = 3,

    /// <summary>
    /// Improvement suggestion
    /// </summary>
    Improvement = 4,

    /// <summary>
    /// Data correction needed
    /// </summary>
    DataCorrection = 5
}

