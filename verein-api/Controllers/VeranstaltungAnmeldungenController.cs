using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.VeranstaltungAnmeldung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing VeranstaltungAnmeldungen (Event Registrations)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VeranstaltungAnmeldungenController : ControllerBase
{
    private readonly IVeranstaltungAnmeldungService _anmeldungService;
    private readonly ILogger<VeranstaltungAnmeldungenController> _logger;

    public VeranstaltungAnmeldungenController(
        IVeranstaltungAnmeldungService anmeldungService,
        ILogger<VeranstaltungAnmeldungenController> logger)
    {
        _anmeldungService = anmeldungService;
        _logger = logger;
    }

    /// <summary>
    /// Get all VeranstaltungAnmeldungen
    /// </summary>
    /// <returns>List of all VeranstaltungAnmeldungen</returns>
    [HttpGet]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetAll()
    {
        try
        {
            var anmeldungDtos = await _anmeldungService.GetAllAsync();
            return Ok(anmeldungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all VeranstaltungAnmeldungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific VeranstaltungAnmeldung by ID
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <returns>VeranstaltungAnmeldung details</returns>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> GetById(int id)
    {
        try
        {
            var anmeldungDto = await _anmeldungService.GetByIdAsync(id);
            if (anmeldungDto == null)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            return Ok(anmeldungDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting VeranstaltungAnmeldung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get VeranstaltungAnmeldungen by Veranstaltung ID
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <returns>List of VeranstaltungAnmeldungen for the specified Veranstaltung</returns>
    [HttpGet("veranstaltung/{veranstaltungId}")]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetByVeranstaltungId(int veranstaltungId)
    {
        try
        {
            var anmeldungDtos = await _anmeldungService.GetByVeranstaltungIdAsync(veranstaltungId);
            return Ok(anmeldungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting VeranstaltungAnmeldungen for Veranstaltung ID {VeranstaltungId}", veranstaltungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get VeranstaltungAnmeldungen by Member ID
    /// </summary>
    /// <param name="mitgliedId">Member ID</param>
    /// <returns>List of VeranstaltungAnmeldungen for the specified Member</returns>
    [HttpGet("mitglied/{mitgliedId}")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetByMitgliedId(int mitgliedId)
    {
        try
        {
            var anmeldungDtos = await _anmeldungService.GetByMitgliedIdAsync(mitgliedId);
            return Ok(anmeldungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting VeranstaltungAnmeldungen for Member ID {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get VeranstaltungAnmeldungen by Status
    /// </summary>
    /// <param name="status">Registration status</param>
    /// <returns>List of VeranstaltungAnmeldungen with the specified status</returns>
    [HttpGet("status/{status}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetByStatus(string status)
    {
        try
        {
            // For now, we'll use a simple mapping. In a real app, this should be handled properly
            if (!int.TryParse(status, out int statusId))
            {
                return BadRequest("Invalid status format");
            }

            var anmeldungDtos = await _anmeldungService.GetByStatusAsync(statusId);
            return Ok(anmeldungDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting VeranstaltungAnmeldungen with status {Status}", status);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new VeranstaltungAnmeldung
    /// </summary>
    /// <param name="createDto">VeranstaltungAnmeldung creation data</param>
    /// <returns>Created VeranstaltungAnmeldung</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> Create([FromBody] CreateVeranstaltungAnmeldungDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var anmeldungDto = await _anmeldungService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = anmeldungDto.Id }, anmeldungDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating VeranstaltungAnmeldung");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating VeranstaltungAnmeldung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing VeranstaltungAnmeldung
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <param name="updateDto">VeranstaltungAnmeldung update data</param>
    /// <returns>Updated VeranstaltungAnmeldung</returns>
    [HttpPut("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> Update(int id, [FromBody] UpdateVeranstaltungAnmeldungDto updateDto, CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var anmeldungDto = await _anmeldungService.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(anmeldungDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating VeranstaltungAnmeldung with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating VeranstaltungAnmeldung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update registration status
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <param name="status">New status</param>
    /// <returns>Updated VeranstaltungAnmeldung</returns>
    [HttpPatch("{id}/status")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> UpdateStatus(int id, [FromBody] string status)
    {
        try
        {
            // For now, we'll use a simple approach. In a real app, this should be a dedicated method
            var anmeldungDto = await _anmeldungService.GetByIdAsync(id);
            if (anmeldungDto == null)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            // Create update DTO with new status
            var updateDto = new UpdateVeranstaltungAnmeldungDto
            {
                MitgliedId = anmeldungDto.MitgliedId,
                Name = anmeldungDto.Name,
                Email = anmeldungDto.Email,
                Telefon = anmeldungDto.Telefon,
                Status = status,
                Bemerkung = anmeldungDto.Bemerkung,
                Preis = anmeldungDto.Preis,
                WaehrungId = anmeldungDto.WaehrungId,
                ZahlungStatusId = anmeldungDto.ZahlungStatusId
            };

            var result = await _anmeldungService.UpdateAsync(id, updateDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating status for VeranstaltungAnmeldung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a VeranstaltungAnmeldung (soft delete)
    /// </summary>
    /// <param name="id">VeranstaltungAnmeldung ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _anmeldungService.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting VeranstaltungAnmeldung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }


}
