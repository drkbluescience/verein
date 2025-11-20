using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Finanz;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for Finanz Dashboard statistics
/// Provides optimized aggregated data for dashboard views
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FinanzDashboardController : ControllerBase
{
    private readonly IFinanzDashboardService _service;
    private readonly ILogger<FinanzDashboardController> _logger;

    public FinanzDashboardController(
        IFinanzDashboardService service,
        ILogger<FinanzDashboardController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get dashboard statistics
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter (for Dernek users). If null, returns all data (Admin only)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dashboard statistics including income, expense, and comparison data</returns>
    /// <response code="200">Returns dashboard statistics</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(FinanzDashboardStatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<FinanzDashboardStatsDto>> GetDashboardStats(
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Getting dashboard stats for vereinId: {VereinId}", vereinId);

            var stats = await _service.GetDashboardStatsAsync(vereinId, cancellationToken);

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard stats for vereinId: {VereinId}", vereinId);
            return StatusCode(500, new { message = "An error occurred while retrieving dashboard statistics" });
        }
    }
}

