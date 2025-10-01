using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Verein;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Vereine (Associations)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VereineController : ControllerBase
{
    private readonly IVereinService _vereinService;
    private readonly ILogger<VereineController> _logger;

    public VereineController(
        IVereinService vereinService,
        ILogger<VereineController> logger)
    {
        _vereinService = vereinService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Vereine
    /// </summary>
    /// <returns>List of all Vereine</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VereinDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDto>>> GetAll()
    {
        try
        {
            var vereinDtos = await _vereinService.GetAllAsync();
            return Ok(vereinDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all Vereine");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific Verein by ID
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <returns>Verein details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinDto>> GetById(int id)
    {
        try
        {
            var vereinDto = await _vereinService.GetByIdAsync(id);
            if (vereinDto == null)
            {
                return NotFound($"Verein with ID {id} not found");
            }

            return Ok(vereinDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Verein with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new Verein
    /// </summary>
    /// <param name="createDto">Verein creation data</param>
    /// <returns>Created Verein</returns>
    [HttpPost]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VereinDto>> Create([FromBody] CreateVereinDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vereinDto = await _vereinService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = vereinDto.Id }, vereinDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating Verein");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Verein");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing Verein
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="updateDto">Verein update data</param>
    /// <returns>Updated Verein</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinDto>> Update(int id, [FromBody] UpdateVereinDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vereinDto = await _vereinService.UpdateAsync(id, updateDto);
            return Ok(vereinDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating Verein with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Verein with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a Verein (soft delete)
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _vereinService.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"Verein with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Verein with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }


}
