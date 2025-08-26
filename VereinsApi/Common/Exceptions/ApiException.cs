namespace VereinsApi.Common.Exceptions;

/// <summary>
/// Custom API exception for handling application-specific errors
/// </summary>
public class ApiException : Exception
{
    /// <summary>
    /// HTTP status code
    /// </summary>
    public int StatusCode { get; }

    /// <summary>
    /// Additional error details
    /// </summary>
    public object? Details { get; }

    /// <summary>
    /// Initializes a new instance of ApiException
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="statusCode">HTTP status code</param>
    /// <param name="details">Additional error details</param>
    public ApiException(string message, int statusCode = 500, object? details = null) 
        : base(message)
    {
        StatusCode = statusCode;
        Details = details;
    }

    /// <summary>
    /// Initializes a new instance of ApiException with inner exception
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="innerException">Inner exception</param>
    /// <param name="statusCode">HTTP status code</param>
    /// <param name="details">Additional error details</param>
    public ApiException(string message, Exception innerException, int statusCode = 500, object? details = null) 
        : base(message, innerException)
    {
        StatusCode = statusCode;
        Details = details;
    }
}
