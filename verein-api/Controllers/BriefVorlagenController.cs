using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Brief;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Brief Vorlagen (Letter Templates)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class BriefVorlagenController : ControllerBase
{
    private readonly IBriefVorlageService _briefVorlageService;
    private readonly ILogger<BriefVorlagenController> _logger;

    public BriefVorlagenController(
        IBriefVorlageService briefVorlageService,
        ILogger<BriefVorlagenController> logger)
    {
        _briefVorlageService = briefVorlageService;
        _logger = logger;
    }

    /// <summary>
    /// Get all letter templates for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<BriefVorlageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BriefVorlageDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var vorlagen = await _briefVorlageService.GetByVereinIdAsync(vereinId);
            return Ok(vorlagen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting templates for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get active letter templates for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/active")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<BriefVorlageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BriefVorlageDto>>> GetActiveByVereinId(int vereinId)
    {
        try
        {
            var vorlagen = await _briefVorlageService.GetActiveByVereinIdAsync(vereinId);
            return Ok(vorlagen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active templates for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific letter template by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BriefVorlageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BriefVorlageDto>> GetById(int id)
    {
        try
        {
            var vorlage = await _briefVorlageService.GetByIdAsync(id);
            if (vorlage == null)
                return NotFound($"Template with ID {id} not found");
            return Ok(vorlage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting template {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get templates by category
    /// </summary>
    [HttpGet("verein/{vereinId}/category/{kategorie}")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<BriefVorlageDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BriefVorlageDto>>> GetByCategory(int vereinId, string kategorie)
    {
        try
        {
            var vorlagen = await _briefVorlageService.GetByCategoryAsync(vereinId, kategorie);
            return Ok(vorlagen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting templates by category for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get all categories for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/categories")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories(int vereinId)
    {
        try
        {
            var categories = await _briefVorlageService.GetCategoriesAsync(vereinId);
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new letter template
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(BriefVorlageDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BriefVorlageDto>> Create([FromBody] CreateBriefVorlageDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vorlage = await _briefVorlageService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = vorlage.Id }, vorlage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating template");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing letter template
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(BriefVorlageDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BriefVorlageDto>> Update(int id, [FromBody] UpdateBriefVorlageDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var vorlage = await _briefVorlageService.UpdateAsync(id, updateDto);
            return Ok(vorlage);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Template with ID {id} not found");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating template {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a letter template
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _briefVorlageService.DeleteAsync(id);
            if (!result)
                return NotFound($"Template with ID {id} not found");
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting template {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

