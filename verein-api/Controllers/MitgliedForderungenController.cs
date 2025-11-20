using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.DTOs.MitgliedForderung;
using VereinsApi.DTOs.MitgliedForderungZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Mitglied Forderungen (Member Claims/Invoices)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class MitgliedForderungenController : ControllerBase
{
    private readonly IMitgliedForderungService _service;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MitgliedForderungenController> _logger;

    public MitgliedForderungenController(
        IMitgliedForderungService service,
        ApplicationDbContext context,
        ILogger<MitgliedForderungenController> logger)
    {
        _service = service;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all Forderungen
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MitgliedForderungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetAll(
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var forderungen = await _service.GetAllAsync(includeDeleted, cancellationToken);
            return Ok(forderungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all forderungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Forderung by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MitgliedForderungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MitgliedForderungDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var forderung = await _service.GetByIdAsync(id, cancellationToken);
            if (forderung == null)
            {
                return NotFound($"Forderung with ID {id} not found");
            }
            return Ok(forderung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting forderung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get payment allocations for a Forderung
    /// </summary>
    [HttpGet("{id:int}/allocations")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedForderungZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedForderungZahlungDto>>> GetAllocations(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var allocations = await _context.MitgliedForderungZahlungen
                .Where(fz => fz.ForderungId == id && fz.DeletedFlag != true)
                .Include(fz => fz.Zahlung)
                .OrderByDescending(fz => fz.Created)
                .Select(fz => new MitgliedForderungZahlungDto
                {
                    Id = fz.Id,
                    ForderungId = fz.ForderungId,
                    ZahlungId = fz.ZahlungId,
                    Betrag = fz.Betrag,
                    Created = fz.Created
                })
                .ToListAsync(cancellationToken);

            return Ok(allocations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting allocations for forderung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Forderungen by Mitglied ID
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedForderungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetByMitglied(
        int mitgliedId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var forderungen = await _service.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
            return Ok(forderungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting forderungen for mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Forderungen by Verein ID
    /// </summary>
    [HttpGet("verein/{vereinId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedForderungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetByVerein(
        int vereinId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var forderungen = await _service.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
            return Ok(forderungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting forderungen for verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get unpaid Forderungen
    /// </summary>
    [HttpGet("unpaid")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedForderungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetUnpaid(
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var forderungen = await _service.GetUnpaidAsync(vereinId, cancellationToken);
            return Ok(forderungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unpaid forderungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get overdue Forderungen
    /// </summary>
    [HttpGet("overdue")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedForderungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedForderungDto>>> GetOverdue(
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var forderungen = await _service.GetOverdueAsync(vereinId, cancellationToken);
            return Ok(forderungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting overdue forderungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get total unpaid amount for a Mitglied
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}/total-unpaid")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    public async Task<ActionResult<decimal>> GetTotalUnpaid(int mitgliedId, CancellationToken cancellationToken = default)
    {
        try
        {
            var total = await _service.GetTotalUnpaidAmountAsync(mitgliedId, cancellationToken);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total unpaid for mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new Forderung
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MitgliedForderungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MitgliedForderungDto>> Create(
        [FromBody] CreateMitgliedForderungDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var created = await _service.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating forderung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update Forderung
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(MitgliedForderungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MitgliedForderungDto>> Update(
        int id,
        [FromBody] UpdateMitgliedForderungDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Forderung with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating forderung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete Forderung
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
                return NotFound($"Forderung with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting forderung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

