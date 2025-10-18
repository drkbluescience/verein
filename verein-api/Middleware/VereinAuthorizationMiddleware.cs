using System.Security.Claims;

namespace VereinsApi.Middleware;

/// <summary>
/// Middleware for Verein-specific authorization checks
/// Ensures Dernek users can only access their own Verein's data
/// </summary>
public class VereinAuthorizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<VereinAuthorizationMiddleware> _logger;

    public VereinAuthorizationMiddleware(RequestDelegate next, ILogger<VereinAuthorizationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip authorization for:
        // - Auth endpoints
        // - Health checks
        // - Swagger
        // - OPTIONS requests (CORS preflight)
        var path = context.Request.Path.Value?.ToLower() ?? "";
        if (path.Contains("/auth/") || 
            path.Contains("/health") || 
            path.Contains("/swagger") ||
            context.Request.Method == "OPTIONS")
        {
            await _next(context);
            return;
        }

        // Check if user is authenticated
        if (!context.User.Identity?.IsAuthenticated ?? true)
        {
            // Allow unauthenticated access for now (will be blocked by [Authorize] attribute)
            await _next(context);
            return;
        }

        // Get user claims
        var userType = context.User.FindFirst("UserType")?.Value;
        var userVereinId = context.User.FindFirst("VereinId")?.Value;

        // Admin users can access everything
        if (userType == "admin")
        {
            await _next(context);
            return;
        }

        // For Dernek users, check VereinId in route or query parameters
        if (userType == "dernek" && !string.IsNullOrEmpty(userVereinId))
        {
            // Extract VereinId from route or query
            var routeVereinId = context.Request.RouteValues["vereinId"]?.ToString();
            var queryVereinId = context.Request.Query["vereinId"].ToString();

            // Check if request is trying to access a different Verein's data
            if (!string.IsNullOrEmpty(routeVereinId) && routeVereinId != userVereinId)
            {
                _logger.LogWarning(
                    "Dernek user {UserVereinId} attempted to access Verein {RequestedVereinId}",
                    userVereinId,
                    routeVereinId);

                context.Response.StatusCode = 403; // Forbidden
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "Forbidden",
                    message = "Bu derneğin verilerine erişim yetkiniz yok."
                });
                return;
            }

            if (!string.IsNullOrEmpty(queryVereinId) && queryVereinId != userVereinId)
            {
                _logger.LogWarning(
                    "Dernek user {UserVereinId} attempted to access Verein {RequestedVereinId}",
                    userVereinId,
                    queryVereinId);

                context.Response.StatusCode = 403; // Forbidden
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "Forbidden",
                    message = "Bu derneğin verilerine erişim yetkiniz yok."
                });
                return;
            }
        }

        await _next(context);
    }
}

/// <summary>
/// Extension method for adding VereinAuthorizationMiddleware
/// </summary>
public static class VereinAuthorizationMiddlewareExtensions
{
    public static IApplicationBuilder UseVereinAuthorization(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<VereinAuthorizationMiddleware>();
    }
}

