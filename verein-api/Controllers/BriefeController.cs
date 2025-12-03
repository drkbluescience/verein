using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Brief;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Briefe (Letter Drafts)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class BriefeController : ControllerBase
{
    private readonly IBriefService _briefService;
    private readonly ILogger<BriefeController> _logger;

    public BriefeController(
        IBriefService briefService,
        ILogger<BriefeController> logger)
    {
        _briefService = briefService;
        _logger = logger;
    }

    /// <summary>
    /// Get all letters for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<BriefDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BriefDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var briefe = await _briefService.GetByVereinIdAsync(vereinId);
            return Ok(briefe);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting letters for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get draft letters for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/drafts")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<BriefDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BriefDto>>> GetDraftsByVereinId(int vereinId)
    {
        try
        {
            var briefe = await _briefService.GetDraftsByVereinIdAsync(vereinId);
            return Ok(briefe);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting drafts for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get sent letters for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/sent")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<BriefDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BriefDto>>> GetSentByVereinId(int vereinId)
    {
        try
        {
            var briefe = await _briefService.GetSentByVereinIdAsync(vereinId);
            return Ok(briefe);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting sent letters for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific letter by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BriefDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BriefDto>> GetById(int id)
    {
        try
        {
            var brief = await _briefService.GetByIdAsync(id);
            if (brief == null)
                return NotFound($"Letter with ID {id} not found");
            return Ok(brief);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting letter {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get statistics for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/statistics")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(BriefStatisticsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<BriefStatisticsDto>> GetStatistics(int vereinId)
    {
        try
        {
            var stats = await _briefService.GetStatisticsAsync(vereinId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statistics for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new letter draft
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(BriefDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BriefDto>> Create([FromBody] CreateBriefDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var brief = await _briefService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = brief.Id }, brief);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating letter");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing letter draft
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(BriefDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BriefDto>> Update(int id, [FromBody] UpdateBriefDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var brief = await _briefService.UpdateAsync(id, updateDto);
            return Ok(brief);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Letter with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating letter {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a letter draft
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _briefService.DeleteAsync(id);
            if (!result)
                return NotFound($"Letter with ID {id} not found");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting letter {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Send a letter to specified members
    /// </summary>
    [HttpPost("send")]
    [ProducesResponseType(typeof(IEnumerable<NachrichtDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<NachrichtDto>>> Send([FromBody] SendBriefDto sendDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nachrichten = await _briefService.SendAsync(sendDto);
            return Ok(nachrichten);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending letter {BriefId}", sendDto.BriefId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create and send a letter in one step
    /// </summary>
    [HttpPost("quick-send")]
    [ProducesResponseType(typeof(IEnumerable<NachrichtDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<NachrichtDto>>> QuickSend([FromBody] QuickSendBriefDto quickSendDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nachrichten = await _briefService.QuickSendAsync(quickSendDto);
            return Ok(nachrichten);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error quick sending letter");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Preview content with placeholders replaced
    /// </summary>
    [HttpPost("preview")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult<string>> PreviewContent([FromBody] PreviewContentDto previewDto)
    {
        try
        {
            var content = await _briefService.ReplacePlaceholdersAsync(
                previewDto.Content, previewDto.MitgliedId, previewDto.VereinId);
            return Ok(content);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error previewing content");
            return StatusCode(500, "Internal server error");
        }
    }
}

/// <summary>
/// DTO for previewing content with placeholders
/// </summary>
public class PreviewContentDto
{
    public string Content { get; set; } = string.Empty;
    public int MitgliedId { get; set; }
    public int VereinId { get; set; }
}

