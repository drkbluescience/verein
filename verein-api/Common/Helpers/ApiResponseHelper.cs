using Microsoft.AspNetCore.Mvc;

namespace VereinsApi.Common.Helpers;

/// <summary>
/// Helper class for creating standardized API responses
/// </summary>
public static class ApiResponseHelper
{
    /// <summary>
    /// Creates a success response with data
    /// </summary>
    /// <typeparam name="T">Type of data</typeparam>
    /// <param name="data">Response data</param>
    /// <param name="message">Success message</param>
    /// <returns>API response</returns>
    public static ApiResponse<T> Success<T>(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message ?? "Operation completed successfully",
            Timestamp = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Creates a success response without data
    /// </summary>
    /// <param name="message">Success message</param>
    /// <returns>API response</returns>
    public static ApiResponse<object> Success(string? message = null)
    {
        return new ApiResponse<object>
        {
            Success = true,
            Data = null,
            Message = message ?? "Operation completed successfully",
            Timestamp = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Creates an error response
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="errors">Validation errors</param>
    /// <returns>API response</returns>
    public static ApiResponse<object> Error(string message, Dictionary<string, string[]>? errors = null)
    {
        return new ApiResponse<object>
        {
            Success = false,
            Data = null,
            Message = message,
            Errors = errors,
            Timestamp = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Creates a paginated response
    /// </summary>
    /// <typeparam name="T">Type of data items</typeparam>
    /// <param name="data">Response data</param>
    /// <param name="totalCount">Total number of items</param>
    /// <param name="page">Current page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="message">Success message</param>
    /// <returns>Paginated API response</returns>
    public static PaginatedApiResponse<T> Paginated<T>(
        IEnumerable<T> data, 
        int totalCount, 
        int page, 
        int pageSize, 
        string? message = null)
    {
        return new PaginatedApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message ?? "Data retrieved successfully",
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            HasNextPage = page * pageSize < totalCount,
            HasPreviousPage = page > 1,
            Timestamp = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Standard API response model
/// </summary>
/// <typeparam name="T">Type of response data</typeparam>
public class ApiResponse<T>
{
    /// <summary>
    /// Indicates if the operation was successful
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Response data
    /// </summary>
    public T? Data { get; set; }

    /// <summary>
    /// Response message
    /// </summary>
    public string? Message { get; set; }

    /// <summary>
    /// Validation or other errors
    /// </summary>
    public Dictionary<string, string[]>? Errors { get; set; }

    /// <summary>
    /// Response timestamp
    /// </summary>
    public DateTime Timestamp { get; set; }
}

/// <summary>
/// Paginated API response model
/// </summary>
/// <typeparam name="T">Type of response data items</typeparam>
public class PaginatedApiResponse<T> : ApiResponse<IEnumerable<T>>
{
    /// <summary>
    /// Total number of items
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Current page number
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    /// Indicates if there is a next page
    /// </summary>
    public bool HasNextPage { get; set; }

    /// <summary>
    /// Indicates if there is a previous page
    /// </summary>
    public bool HasPreviousPage { get; set; }
}
