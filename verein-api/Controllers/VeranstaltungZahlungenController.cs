using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.VeranstaltungZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Veranstaltung Zahlungen (Event Payments)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class VeranstaltungZahlungenController : ControllerBase
{
    private readonly IVeranstaltungZahlungService _service;
    private readonly ILogger<VeranstaltungZahlungenController> _logger;

    public VeranstaltungZahlungenController(
        IVeranstaltungZahlungService service,
        ILogger<VeranstaltungZahlungenController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all Veranstaltung Zahlungen
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungZahlungDto>>> GetAll(
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
            _logger.LogError(ex, "Error getting all veranstaltung zahlungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Veranstaltung Zahlung by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(VeranstaltungZahlungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungZahlungDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlung = await _service.GetByIdAsync(id, cancellationToken);
            if (zahlung == null)
            {
                return NotFound($"Veranstaltung zahlung with ID {id} not found");
            }
            return Ok(zahlung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting veranstaltung zahlung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlungen by Veranstaltung ID
    /// </summary>
    [HttpGet("veranstaltung/{veranstaltungId:int}")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungZahlungDto>>> GetByVeranstaltung(
        int veranstaltungId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByVeranstaltungIdAsync(veranstaltungId, includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting zahlungen for veranstaltung {VeranstaltungId}", veranstaltungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlungen by Anmeldung ID
    /// </summary>
    [HttpGet("anmeldung/{anmeldungId:int}")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungZahlungDto>>> GetByAnmeldung(
        int anmeldungId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByAnmeldungIdAsync(anmeldungId, includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting zahlungen for anmeldung {AnmeldungId}", anmeldungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Zahlungen by Mitglied ID
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungZahlungDto>>> GetByMitglied(
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
    /// Get Zahlungen by date range
    /// </summary>
    [HttpGet("date-range")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungZahlungDto>>> GetByDateRange(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate,
        [FromQuery] int? veranstaltungId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByDateRangeAsync(fromDate, toDate, veranstaltungId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting veranstaltung zahlungen by date range");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get total payment amount for a Veranstaltung
    /// </summary>
    [HttpGet("veranstaltung/{veranstaltungId:int}/total")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    public async Task<ActionResult<decimal>> GetTotalPayment(
        int veranstaltungId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var total = await _service.GetTotalPaymentAmountAsync(veranstaltungId, cancellationToken);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total payment for veranstaltung {VeranstaltungId}", veranstaltungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new Veranstaltung Zahlung
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(VeranstaltungZahlungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VeranstaltungZahlungDto>> Create(
        [FromBody] CreateVeranstaltungZahlungDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var created = await _service.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating veranstaltung zahlung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update Veranstaltung Zahlung
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(VeranstaltungZahlungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungZahlungDto>> Update(
        int id,
        [FromBody] UpdateVeranstaltungZahlungDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Veranstaltung zahlung with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating veranstaltung zahlung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete Veranstaltung Zahlung
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
                return NotFound($"Veranstaltung zahlung with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting veranstaltung zahlung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

