using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.RechtlicheDaten;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing RechtlicheDaten (Legal Data)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class RechtlicheDatenController : ControllerBase
{
    private readonly IRechtlicheDatenService _service;
    private readonly ILogger<RechtlicheDatenController> _logger;

    public RechtlicheDatenController(
        IRechtlicheDatenService service,
        ILogger<RechtlicheDatenController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get RechtlicheDaten by ID
    /// </summary>
    [HttpGet("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(RechtlicheDatenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RechtlicheDatenDto>> GetById(int id)
    {
        try
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting RechtlicheDaten by ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get RechtlicheDaten by Verein ID
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(RechtlicheDatenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RechtlicheDatenDto>> GetByVereinId(int vereinId)
    {
        try
        {
            var result = await _service.GetByVereinIdAsync(vereinId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting RechtlicheDaten by VereinId {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new RechtlicheDaten
    /// </summary>
    [HttpPost]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(RechtlicheDatenDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RechtlicheDatenDto>> Create([FromBody] CreateRechtlicheDatenDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating RechtlicheDaten");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update existing RechtlicheDaten
    /// </summary>
    [HttpPut("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(RechtlicheDatenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RechtlicheDatenDto>> Update(int id, [FromBody] UpdateRechtlicheDatenDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.UpdateAsync(id, updateDto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating RechtlicheDaten with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete RechtlicheDaten (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    [RequireAdmin]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting RechtlicheDaten with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

