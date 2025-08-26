namespace VereinsApi.Common.Models;

/// <summary>
/// Represents a paginated result set
/// </summary>
/// <typeparam name="T">Type of items in the result</typeparam>
public class PagedResult<T>
{
    /// <summary>
    /// Items in the current page
    /// </summary>
    public IEnumerable<T> Items { get; set; } = new List<T>();

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    /// <summary>
    /// Whether there is a previous page
    /// </summary>
    public bool HasPreviousPage => PageNumber > 1;

    /// <summary>
    /// Whether there is a next page
    /// </summary>
    public bool HasNextPage => PageNumber < TotalPages;

    /// <summary>
    /// Number of items in the current page
    /// </summary>
    public int ItemCount => Items.Count();

    /// <summary>
    /// Starting item number for the current page
    /// </summary>
    public int StartItem => TotalCount == 0 ? 0 : (PageNumber - 1) * PageSize + 1;

    /// <summary>
    /// Ending item number for the current page
    /// </summary>
    public int EndItem => TotalCount == 0 ? 0 : StartItem + ItemCount - 1;
}
