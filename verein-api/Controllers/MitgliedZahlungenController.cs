using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.MitgliedZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Mitglied Zahlungen (Member Payments)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class MitgliedZahlungenController : ControllerBase
{
    private readonly IMitgliedZahlungService _service;
    private readonly ILogger<MitgliedZahlungenController> _logger;

    public MitgliedZahlungenController(
        IMitgliedZahlungService service,
        ILogger<MitgliedZahlungenController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all Zahlungen
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MitgliedZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedZahlungDto>>> GetAll(
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetAllAsync(includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all zahlungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlung by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MitgliedZahlungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MitgliedZahlungDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlung = await _service.GetByIdAsync(id, cancellationToken);
            if (zahlung == null)
            {
                return NotFound($"Zahlung with ID {id} not found");
            }
            return Ok(zahlung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting zahlung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlungen by Mitglied ID
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedZahlungDto>>> GetByMitglied(
        int mitgliedId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting zahlungen for mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlungen by Verein ID
    /// </summary>
    [HttpGet("verein/{vereinId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedZahlungDto>>> GetByVerein(
        int vereinId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting zahlungen for verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get unallocated Zahlungen
    /// </summary>
    [HttpGet("unallocated")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedZahlungDto>>> GetUnallocated(
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetUnallocatedAsync(vereinId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unallocated zahlungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlungen by date range
    /// </summary>
    [HttpGet("date-range")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedZahlungDto>>> GetByDateRange(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate,
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting zahlungen by date range");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get total payment amount for a Mitglied
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}/total")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    public async Task<ActionResult<decimal>> GetTotalPayment(
        int mitgliedId,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var total = await _service.GetTotalPaymentAmountAsync(mitgliedId, fromDate, toDate, cancellationToken);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total payment for mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new Zahlung
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MitgliedZahlungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MitgliedZahlungDto>> Create(
        [FromBody] CreateMitgliedZahlungDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var created = await _service.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating zahlung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update Zahlung
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(MitgliedZahlungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MitgliedZahlungDto>> Update(
        int id,
        [FromBody] UpdateMitgliedZahlungDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Zahlung with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating zahlung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete Zahlung
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _service.DeleteAsync(id, cancellationToken);
            if (!result)
            {
                return NotFound($"Zahlung with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting zahlung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

