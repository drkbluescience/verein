using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Verein;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Vereine (Associations)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize] // Require authentication for all endpoints
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
    [RequireAdmin] // Only Admin can view all Vereine
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
    [RequireAdmin] // Only Admin can create new Vereine
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
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict while creating Verein");
            return Conflict(ex.Message);
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
    [RequireAdminOrDernek] // Admin or Dernek can update (Dernek only their own)
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
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict while updating Verein with ID {Id}", id);
            return Conflict(ex.Message);
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
    [RequireAdmin] // Only Admin can delete Vereine
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

    /// <summary>
    /// Get all active Vereine
    /// </summary>
    /// <returns>List of active Vereine</returns>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<VereinDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<VereinDto>>> GetActive()
    {
        try
        {
            var vereinDtos = await _vereinService.GetActiveVereineAsync();
            return Ok(vereinDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting active Vereine");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a Verein with full details (including addresses, bank accounts, etc.)
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <returns>Verein with full details</returns>
    [HttpGet("{id}/full-details")]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<VereinDto>> GetFullDetails(int id)
    {
        try
        {
            var vereinDto = await _vereinService.GetFullDetailsAsync(id);
            if (vereinDto == null)
            {
                return NotFound($"Verein with ID {id} not found");
            }

            return Ok(vereinDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting full details for Verein with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
