using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Veranstaltung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Veranstaltungen (Events)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VeranstaltungenController : ControllerBase
{
    private readonly IVeranstaltungService _veranstaltungService;
    private readonly ILogger<VeranstaltungenController> _logger;

    public VeranstaltungenController(
        IVeranstaltungService veranstaltungService,
        ILogger<VeranstaltungenController> logger)
    {
        _veranstaltungService = veranstaltungService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Veranstaltungen
    /// </summary>
    /// <returns>List of all Veranstaltungen</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungDto>>> GetAll()
    {
        try
        {
            var veranstaltungDtos = await _veranstaltungService.GetAllAsync();
            return Ok(veranstaltungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all Veranstaltungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific Veranstaltung by ID
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <returns>Veranstaltung details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(VeranstaltungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungDto>> GetById(int id)
    {
        try
        {
            var veranstaltungDto = await _veranstaltungService.GetByIdAsync(id);
            if (veranstaltungDto == null)
            {
                return NotFound($"Veranstaltung with ID {id} not found");
            }

            return Ok(veranstaltungDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Veranstaltung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Veranstaltungen by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <returns>List of Veranstaltungen for the specified Verein</returns>
    [HttpGet("verein/{vereinId}")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var veranstaltungDtos = await _veranstaltungService.GetByVereinIdAsync(vereinId);
            return Ok(veranstaltungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Veranstaltungen for Verein ID {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get upcoming Veranstaltungen
    /// </summary>
    /// <returns>List of upcoming Veranstaltungen</returns>
    [HttpGet("upcoming")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungDto>>> GetUpcoming()
    {
        try
        {
            var veranstaltungDtos = await _veranstaltungService.GetUpcomingAsync();
            return Ok(veranstaltungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting upcoming Veranstaltungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Veranstaltungen by date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <returns>List of Veranstaltungen in the specified date range</returns>
    [HttpGet("date-range")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungDto>>> GetByDateRange(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate)
    {
        try
        {
            var veranstaltungDtos = await _veranstaltungService.GetByDateRangeAsync(startDate, endDate);
            return Ok(veranstaltungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Veranstaltungen for date range {StartDate} - {EndDate}", startDate, endDate);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new Veranstaltung
    /// </summary>
    /// <param name="createDto">Veranstaltung creation data</param>
    /// <returns>Created Veranstaltung</returns>
    [HttpPost]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VeranstaltungDto>> Create([FromBody] CreateVeranstaltungDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var veranstaltungDto = await _veranstaltungService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = veranstaltungDto.Id }, veranstaltungDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating Veranstaltung");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Veranstaltung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing Veranstaltung
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <param name="updateDto">Veranstaltung update data</param>
    /// <returns>Updated Veranstaltung</returns>
    [HttpPut("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungDto>> Update(int id, [FromBody] UpdateVeranstaltungDto updateDto, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var veranstaltungDto = await _veranstaltungService.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(veranstaltungDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating Veranstaltung with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Veranstaltung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a Veranstaltung (soft delete)
    /// </summary>
    /// <param name="id">Veranstaltung ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _veranstaltungService.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"Veranstaltung with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Veranstaltung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }


}
