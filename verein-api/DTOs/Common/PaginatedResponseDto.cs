using System.ComponentModel.DataAnnotations;

namespace VereinsApi.DTOs.Common;

/// <summary>
/// Generic paginated response DTO for API responses
/// </summary>
/// <typeparam name="T">Type of data items</typeparam>
public class PaginatedResponseDto<T>
{
    /// <summary>
    /// Data items for the current page
    /// </summary>
    public List<T> Data { get; set; } = new();

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    /// Whether there are more pages available
    /// </summary>
    public bool HasMore { get; set; }

    /// <summary>
    /// Whether this is the first page
    /// </summary>
    public bool IsFirstPage { get; set; }

    /// <summary>
    /// Whether this is the last page
    /// </summary>
    public bool IsLastPage { get; set; }
}

/// <summary>
/// Pagination request parameters
/// </summary>
public class PaginationRequestDto
{
    /// <summary>
    /// Page number (1-based, default: 1)
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Number of items per page (default: 20, max: 100)
    /// </summary>
    [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
    public int PageSize { get; set; } = 20;
}