using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Brief;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Nachrichten (Messages) - Member inbox
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class NachrichtenController : ControllerBase
{
    private readonly INachrichtService _nachrichtService;
    private readonly ILogger<NachrichtenController> _logger;

    public NachrichtenController(
        INachrichtService nachrichtService,
        ILogger<NachrichtenController> logger)
    {
        _nachrichtService = nachrichtService;
        _logger = logger;
    }

    /// <summary>
    /// Get all messages for a member (inbox)
    /// </summary>
    [HttpGet("mitglied/{mitgliedId}")]
    [ProducesResponseType(typeof(IEnumerable<NachrichtDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NachrichtDto>>> GetByMitgliedId(int mitgliedId)
    {
        try
        {
            var nachrichten = await _nachrichtService.GetByMitgliedIdAsync(mitgliedId);
            return Ok(nachrichten);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting messages for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get unread messages for a member
    /// </summary>
    [HttpGet("mitglied/{mitgliedId}/unread")]
    [ProducesResponseType(typeof(IEnumerable<NachrichtDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NachrichtDto>>> GetUnreadByMitgliedId(int mitgliedId)
    {
        try
        {
            var nachrichten = await _nachrichtService.GetUnreadByMitgliedIdAsync(mitgliedId);
            return Ok(nachrichten);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unread messages for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get unread message count for a member
    /// </summary>
    [HttpGet("mitglied/{mitgliedId}/unread-count")]
    [ProducesResponseType(typeof(UnreadCountDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<UnreadCountDto>> GetUnreadCount(int mitgliedId)
    {
        try
        {
            var count = await _nachrichtService.GetUnreadCountAsync(mitgliedId);
            return Ok(new UnreadCountDto { Count = count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unread count for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get messages sent from a specific letter (for Verein)
    /// </summary>
    [HttpGet("brief/{briefId}")]
    [ProducesResponseType(typeof(IEnumerable<NachrichtDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NachrichtDto>>> GetByBriefId(int briefId)
    {
        try
        {
            var nachrichten = await _nachrichtService.GetByBriefIdAsync(briefId);
            return Ok(nachrichten);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting messages for Brief {BriefId}", briefId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get all messages sent by a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<NachrichtDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<NachrichtDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var nachrichten = await _nachrichtService.GetByVereinIdAsync(vereinId);
            return Ok(nachrichten);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting messages for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific message by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(NachrichtDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<NachrichtDto>> GetById(int id)
    {
        try
        {
            var nachricht = await _nachrichtService.GetByIdAsync(id);
            if (nachricht == null)
                return NotFound($"Message with ID {id} not found");
            return Ok(nachricht);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting message {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Mark a message as read
    /// </summary>
    [HttpPatch("{id}/read")]
    [ProducesResponseType(typeof(NachrichtDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<NachrichtDto>> MarkAsRead(int id)
    {
        try
        {
            var nachricht = await _nachrichtService.MarkAsReadAsync(id);
            return Ok(nachricht);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Message with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking message {Id} as read", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Mark multiple messages as read
    /// </summary>
    [HttpPatch("mark-read")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<ActionResult<int>> MarkMultipleAsRead([FromBody] List<int> ids)
    {
        try
        {
            var count = await _nachrichtService.MarkMultipleAsReadAsync(ids);
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking messages as read");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a message (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _nachrichtService.DeleteAsync(id);
            if (!result)
                return NotFound($"Message with ID {id} not found");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting message {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get member statistics
    /// </summary>
    [HttpGet("mitglied/{mitgliedId}/statistics")]
    [ProducesResponseType(typeof(BriefStatisticsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<BriefStatisticsDto>> GetMemberStatistics(int mitgliedId)
    {
        try
        {
            var stats = await _nachrichtService.GetMemberStatisticsAsync(mitgliedId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }
}

