using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace VereinsApi.Attributes;

/// <summary>
/// Authorization attribute that ensures Dernek users can only access their own Verein's data
/// Admin users can access all data
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequireVereinAccessAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _vereinIdParameterName;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="vereinIdParameterName">Name of the parameter containing VereinId (default: "vereinId")</param>
    public RequireVereinAccessAttribute(string vereinIdParameterName = "vereinId")
    {
        _vereinIdParameterName = vereinIdParameterName;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Check if user is authenticated
        if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Get user claims
        var userType = context.HttpContext.User.FindFirst("UserType")?.Value;
        var userVereinId = context.HttpContext.User.FindFirst("VereinId")?.Value;

        // Admin users can access everything
        if (userType == "admin")
        {
            return;
        }

        // For Dernek users, check VereinId
        if (userType == "dernek")
        {
            if (string.IsNullOrEmpty(userVereinId))
            {
                context.Result = new ForbidResult();
                return;
            }

            // Try to get VereinId from route, query, or body
            string? requestedVereinId = null;

            // Check route values
            if (context.RouteData.Values.ContainsKey(_vereinIdParameterName))
            {
                requestedVereinId = context.RouteData.Values[_vereinIdParameterName]?.ToString();
            }

            // Check query parameters
            if (string.IsNullOrEmpty(requestedVereinId) && context.HttpContext.Request.Query.ContainsKey(_vereinIdParameterName))
            {
                requestedVereinId = context.HttpContext.Request.Query[_vereinIdParameterName].ToString();
            }

            // If VereinId is specified and doesn't match user's VereinId, deny access
            if (!string.IsNullOrEmpty(requestedVereinId) && requestedVereinId != userVereinId)
            {
                context.Result = new ForbidResult();
                return;
            }
        }

        // Mitglied users - allow access (specific permissions will be checked elsewhere)
        // They can only access their own data, which is handled by other authorization logic
    }
}

/// <summary>
/// Authorization attribute that requires Admin role
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequireAdminAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var logger = context.HttpContext.RequestServices.GetService<ILogger<RequireAdminAttribute>>();

        // Check if user is authenticated
        if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
        {
            logger?.LogWarning("🔒 RequireAdmin: User not authenticated");
            context.Result = new UnauthorizedResult();
            return;
        }

        // Get user type
        var userType = context.HttpContext.User.FindFirst("UserType")?.Value;
        logger?.LogInformation("🔍 RequireAdmin: UserType claim = {UserType}", userType ?? "NULL");

        // Only admin users can access
        if (userType != "admin")
        {
            logger?.LogWarning("⛔ RequireAdmin: Access denied - UserType is '{UserType}', expected 'admin'", userType);
            context.Result = new ForbidResult();
            return;
        }

        logger?.LogInformation("✅ RequireAdmin: Access granted");
    }
}

/// <summary>
/// Authorization attribute that requires Admin or Dernek role
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequireAdminOrDernekAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Check if user is authenticated
        if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // Get user type
        var userType = context.HttpContext.User.FindFirst("UserType")?.Value;

        // Only admin or dernek users can access
        if (userType != "admin" && userType != "dernek")
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}

