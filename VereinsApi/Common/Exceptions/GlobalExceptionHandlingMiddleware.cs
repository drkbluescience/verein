using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace VereinsApi.Common.Exceptions;

/// <summary>
/// Global exception handling middleware
/// </summary>
public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred. Request: {Method} {Path}", 
                context.Request.Method, context.Request.Path);
            
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        var errorResponse = new ErrorResponse();

        switch (exception)
        {
            case ArgumentNullException ex:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = "Required parameter is missing";
                errorResponse.Details = ex.Message;
                break;

            case ArgumentException ex:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = ex.Message;
                errorResponse.Details = "Invalid argument provided";
                break;

            case InvalidOperationException ex:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse.Message = ex.Message;
                errorResponse.Details = "Invalid operation";
                break;

            case UnauthorizedAccessException:
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse.Message = "Unauthorized access";
                errorResponse.Details = "You are not authorized to perform this action";
                break;

            case KeyNotFoundException ex:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse.Message = "Resource not found";
                errorResponse.Details = ex.Message;
                break;

            case DbUpdateConcurrencyException:
                response.StatusCode = (int)HttpStatusCode.Conflict;
                errorResponse.Message = "Concurrency conflict";
                errorResponse.Details = "The record was modified by another user. Please refresh and try again.";
                break;

            case DbUpdateException ex:
                response.StatusCode = (int)HttpStatusCode.Conflict;
                errorResponse.Message = "Database operation failed";
                errorResponse.Details = GetDbUpdateExceptionMessage(ex);
                break;

            case TimeoutException:
                response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                errorResponse.Message = "Request timeout";
                errorResponse.Details = "The operation took too long to complete";
                break;

            case NotSupportedException ex:
                response.StatusCode = (int)HttpStatusCode.NotImplemented;
                errorResponse.Message = "Operation not supported";
                errorResponse.Details = ex.Message;
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorResponse.Message = "An internal server error occurred";
                errorResponse.Details = "Please try again later or contact support if the problem persists";
                break;
        }

        errorResponse.StatusCode = response.StatusCode;
        errorResponse.Timestamp = DateTime.UtcNow;
        errorResponse.Path = context.Request.Path;
        errorResponse.Method = context.Request.Method;

        var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        await response.WriteAsync(jsonResponse);
    }

    private static string GetDbUpdateExceptionMessage(DbUpdateException ex)
    {
        if (ex.InnerException?.Message.Contains("UNIQUE constraint failed") == true ||
            ex.InnerException?.Message.Contains("duplicate key") == true)
        {
            return "A record with the same unique identifier already exists";
        }

        if (ex.InnerException?.Message.Contains("FOREIGN KEY constraint failed") == true ||
            ex.InnerException?.Message.Contains("foreign key constraint") == true)
        {
            return "Referenced record does not exist or cannot be deleted due to existing references";
        }

        if (ex.InnerException?.Message.Contains("CHECK constraint failed") == true)
        {
            return "Data validation constraint violation";
        }

        return "Database operation failed due to data constraints";
    }
}

/// <summary>
/// Standard error response model
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// HTTP status code
    /// </summary>
    public int StatusCode { get; set; }

    /// <summary>
    /// Error message
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Additional error details
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// Timestamp when the error occurred
    /// </summary>
    public DateTime Timestamp { get; set; }

    /// <summary>
    /// Request path where the error occurred
    /// </summary>
    public string? Path { get; set; }

    /// <summary>
    /// HTTP method of the request
    /// </summary>
    public string? Method { get; set; }

    /// <summary>
    /// Correlation ID for tracking
    /// </summary>
    public string? CorrelationId { get; set; }

    /// <summary>
    /// Validation errors (if applicable)
    /// </summary>
    public Dictionary<string, string[]>? ValidationErrors { get; set; }
}
