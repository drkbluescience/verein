using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.VeranstaltungAnmeldung;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing VeranstaltungAnmeldungen (Event Registrations)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VeranstaltungAnmeldungenController : ControllerBase
{
    private readonly IRepository<VeranstaltungAnmeldung> _anmeldungRepository;
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly ILogger<VeranstaltungAnmeldungenController> _logger;

    public VeranstaltungAnmeldungenController(
        IRepository<VeranstaltungAnmeldung> anmeldungRepository,
        IRepository<Veranstaltung> veranstaltungRepository,
        ILogger<VeranstaltungAnmeldungenController> logger)
    {
        _anmeldungRepository = anmeldungRepository;
        _veranstaltungRepository = veranstaltungRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all VeranstaltungAnmeldungen
    /// </summary>
    /// <returns>List of all VeranstaltungAnmeldungen</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetAll()
    {
        try
        {
            var anmeldungen = await _anmeldungRepository.GetAllAsync();
            var anmeldungDtos = anmeldungen.Select(a => MapToDto(a));

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
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> GetById(int id)
    {
        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(id);
            if (anmeldung == null)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            var anmeldungDto = MapToDto(anmeldung);
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
            var anmeldungen = await _anmeldungRepository.GetAsync(a => a.VeranstaltungId == veranstaltungId);
            var anmeldungDtos = anmeldungen.Select(a => MapToDto(a));

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
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetByMitgliedId(int mitgliedId)
    {
        try
        {
            var anmeldungen = await _anmeldungRepository.GetAsync(a => a.MitgliedId == mitgliedId);
            var anmeldungDtos = anmeldungen.Select(a => MapToDto(a));

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
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungAnmeldungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungAnmeldungDto>>> GetByStatus(string status)
    {
        try
        {
            var anmeldungen = await _anmeldungRepository.GetAsync(a => a.Status == status);
            var anmeldungDtos = anmeldungen.Select(a => MapToDto(a));

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

            // Check if Veranstaltung exists
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(createDto.VeranstaltungId);
            if (veranstaltung == null)
            {
                return BadRequest($"Veranstaltung with ID {createDto.VeranstaltungId} not found");
            }

            // Check if registration is still open (if event hasn't started yet)
            if (veranstaltung.Startdatum <= DateTime.Now)
            {
                return BadRequest("Registration is closed - event has already started");
            }

            // Check if there are available spots
            if (veranstaltung.MaxTeilnehmer.HasValue)
            {
                var existingRegistrations = await _anmeldungRepository.GetAsync(a => 
                    a.VeranstaltungId == createDto.VeranstaltungId && a.Status != "Cancelled");
                
                if (existingRegistrations.Count() >= veranstaltung.MaxTeilnehmer.Value)
                {
                    return BadRequest("Event is fully booked - no available spots");
                }
            }

            var anmeldung = MapFromCreateDto(createDto);
            anmeldung.Status = "Registered"; // Default status

            await _anmeldungRepository.AddAsync(anmeldung);
            await _anmeldungRepository.SaveChangesAsync();

            var anmeldungDto = MapToDto(anmeldung);
            return CreatedAtAction(nameof(GetById), new { id = anmeldung.Id }, anmeldungDto);
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
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> Update(int id, [FromBody] CreateVeranstaltungAnmeldungDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var anmeldung = await _anmeldungRepository.GetByIdAsync(id);
            if (anmeldung == null)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            MapFromCreateDto(updateDto, anmeldung);

            await _anmeldungRepository.UpdateAsync(anmeldung);
            await _anmeldungRepository.SaveChangesAsync();

            var anmeldungDto = MapToDto(anmeldung);
            return Ok(anmeldungDto);
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
    [ProducesResponseType(typeof(VeranstaltungAnmeldungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungAnmeldungDto>> UpdateStatus(int id, [FromBody] string status)
    {
        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(id);
            if (anmeldung == null)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            anmeldung.Status = status;
            // Audit fields set automatically by system
            anmeldung.Modified = DateTime.UtcNow;
            anmeldung.ModifiedBy = GetCurrentUserId();

            await _anmeldungRepository.UpdateAsync(anmeldung);
            await _anmeldungRepository.SaveChangesAsync();

            var anmeldungDto = MapToDto(anmeldung);
            return Ok(anmeldungDto);
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
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var anmeldung = await _anmeldungRepository.GetByIdAsync(id);
            if (anmeldung == null)
            {
                return NotFound($"VeranstaltungAnmeldung with ID {id} not found");
            }

            // Soft delete: Set DeletedFlag and audit fields
            anmeldung.DeletedFlag = true;
            anmeldung.Status = "Cancelled";
            anmeldung.Modified = DateTime.UtcNow;
            anmeldung.ModifiedBy = GetCurrentUserId();

            await _anmeldungRepository.UpdateAsync(anmeldung);
            await _anmeldungRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting VeranstaltungAnmeldung with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    #region Private Helper Methods

    /// <summary>
    /// Get current user ID from authentication context
    /// For now returns a default value, should be implemented with proper authentication
    /// </summary>
    /// <returns>Current user ID</returns>
    private int? GetCurrentUserId()
    {
        // TODO: Implement proper authentication and get user ID from JWT token or session
        // For now, return null or a default value
        // Example implementation:
        // var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        // return userIdClaim != null ? int.Parse(userIdClaim.Value) : null;

        return null; // Will be null until authentication is implemented
    }

    #endregion

    #region Private Mapping Methods

    private VeranstaltungAnmeldungDto MapToDto(VeranstaltungAnmeldung anmeldung)
    {
        return new VeranstaltungAnmeldungDto
        {
            Id = anmeldung.Id,
            VeranstaltungId = anmeldung.VeranstaltungId,
            MitgliedId = anmeldung.MitgliedId,
            Name = anmeldung.Name,
            Email = anmeldung.Email,
            Telefon = anmeldung.Telefon,
            Status = anmeldung.Status,
            Bemerkung = anmeldung.Bemerkung,
            Preis = anmeldung.Preis,
            WaehrungId = anmeldung.WaehrungId,
            ZahlungStatusId = anmeldung.ZahlungStatusId,
            Created = anmeldung.Created,
            CreatedBy = anmeldung.CreatedBy,
            Modified = anmeldung.Modified,
            ModifiedBy = anmeldung.ModifiedBy,
            DeletedFlag = anmeldung.DeletedFlag
        };
    }

    private VeranstaltungAnmeldung MapFromCreateDto(CreateVeranstaltungAnmeldungDto createDto)
    {
        return new VeranstaltungAnmeldung
        {
            VeranstaltungId = createDto.VeranstaltungId,
            MitgliedId = createDto.MitgliedId,
            Name = createDto.Name,
            Email = createDto.Email,
            Telefon = createDto.Telefon,
            Bemerkung = createDto.Bemerkung,
            Preis = createDto.Preis,
            WaehrungId = createDto.WaehrungId,
            ZahlungStatusId = createDto.ZahlungStatusId,
            // Audit fields set automatically by system
            Created = DateTime.UtcNow,
            CreatedBy = GetCurrentUserId(),
            DeletedFlag = false
        };
    }

    private void MapFromCreateDto(CreateVeranstaltungAnmeldungDto updateDto, VeranstaltungAnmeldung anmeldung)
    {
        anmeldung.VeranstaltungId = updateDto.VeranstaltungId;
        anmeldung.MitgliedId = updateDto.MitgliedId;
        anmeldung.Name = updateDto.Name;
        anmeldung.Email = updateDto.Email;
        anmeldung.Telefon = updateDto.Telefon;
        anmeldung.Bemerkung = updateDto.Bemerkung;
        anmeldung.Preis = updateDto.Preis;
        anmeldung.WaehrungId = updateDto.WaehrungId;
        anmeldung.ZahlungStatusId = updateDto.ZahlungStatusId;
        // Audit fields set automatically by system
        anmeldung.Modified = DateTime.UtcNow;
        anmeldung.ModifiedBy = GetCurrentUserId();
    }

    #endregion
}
