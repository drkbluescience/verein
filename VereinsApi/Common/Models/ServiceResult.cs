namespace VereinsApi.Common.Models;

/// <summary>
/// Generic service result wrapper
/// </summary>
/// <typeparam name="T">The type of data returned</typeparam>
public class ServiceResult<T>
{
    /// <summary>
    /// Indicates if the operation was successful
    /// </summary>
    public bool IsSuccess { get; set; }

    /// <summary>
    /// The data returned from the operation
    /// </summary>
    public T? Data { get; set; }

    /// <summary>
    /// Error message if operation failed
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// List of validation errors
    /// </summary>
    public List<string> Errors { get; set; } = new();

    /// <summary>
    /// Creates a successful result with data
    /// </summary>
    /// <param name="data">The data to return</param>
    /// <returns>Successful service result</returns>
    public static ServiceResult<T> Success(T data)
    {
        return new ServiceResult<T>
        {
            IsSuccess = true,
            Data = data
        };
    }

    /// <summary>
    /// Creates a failed result with error message
    /// </summary>
    /// <param name="errorMessage">The error message</param>
    /// <returns>Failed service result</returns>
    public static ServiceResult<T> Failure(string errorMessage)
    {
        return new ServiceResult<T>
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            Errors = new List<string> { errorMessage }
        };
    }

    /// <summary>
    /// Creates a failed result with multiple errors
    /// </summary>
    /// <param name="errors">List of error messages</param>
    /// <returns>Failed service result</returns>
    public static ServiceResult<T> Failure(List<string> errors)
    {
        return new ServiceResult<T>
        {
            IsSuccess = false,
            ErrorMessage = string.Join(", ", errors),
            Errors = errors
        };
    }
}

/// <summary>
/// Non-generic service result for operations that don't return data
/// </summary>
public class ServiceResult
{
    /// <summary>
    /// Indicates if the operation was successful
    /// </summary>
    public bool IsSuccess { get; set; }

    /// <summary>
    /// Error message if operation failed
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// List of validation errors
    /// </summary>
    public List<string> Errors { get; set; } = new();

    /// <summary>
    /// Creates a successful result
    /// </summary>
    /// <returns>Successful service result</returns>
    public static ServiceResult Success()
    {
        return new ServiceResult
        {
            IsSuccess = true
        };
    }

    /// <summary>
    /// Creates a failed result with error message
    /// </summary>
    /// <param name="errorMessage">The error message</param>
    /// <returns>Failed service result</returns>
    public static ServiceResult Failure(string errorMessage)
    {
        return new ServiceResult
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            Errors = new List<string> { errorMessage }
        };
    }

    /// <summary>
    /// Creates a failed result with multiple errors
    /// </summary>
    /// <param name="errors">List of error messages</param>
    /// <returns>Failed service result</returns>
    public static ServiceResult Failure(List<string> errors)
    {
        return new ServiceResult
        {
            IsSuccess = false,
            ErrorMessage = string.Join(", ", errors),
            Errors = errors
        };
    }
}
