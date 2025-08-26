using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Veranstaltung;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Veranstaltungen (Events)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VeranstaltungenController : ControllerBase
{
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly ILogger<VeranstaltungenController> _logger;

    public VeranstaltungenController(
        IRepository<Veranstaltung> veranstaltungRepository,
        ILogger<VeranstaltungenController> logger)
    {
        _veranstaltungRepository = veranstaltungRepository;
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
            var veranstaltungen = await _veranstaltungRepository.GetAllAsync();
            var veranstaltungDtos = veranstaltungen.Select(v => MapToDto(v));

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
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id);
            if (veranstaltung == null)
            {
                return NotFound($"Veranstaltung with ID {id} not found");
            }

            var veranstaltungDto = MapToDto(veranstaltung);
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
            var veranstaltungen = await _veranstaltungRepository.GetAsync(v => v.VereinId == vereinId);
            var veranstaltungDtos = veranstaltungen.Select(v => MapToDto(v));

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
            var now = DateTime.Now;
            var veranstaltungen = await _veranstaltungRepository.GetAsync(v => v.Startdatum > now);
            var veranstaltungDtos = veranstaltungen.Select(v => MapToDto(v)).OrderBy(v => v.Startdatum);

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
            var veranstaltungen = await _veranstaltungRepository.GetAsync(v =>
                v.Startdatum >= startDate && v.Startdatum <= endDate);
            var veranstaltungDtos = veranstaltungen.Select(v => MapToDto(v)).OrderBy(v => v.Startdatum);

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

            // Validate dates
            if (createDto.Enddatum.HasValue && createDto.Enddatum <= createDto.Startdatum)
            {
                return BadRequest("End date must be after start date");
            }

            var veranstaltung = MapFromCreateDto(createDto);

            await _veranstaltungRepository.AddAsync(veranstaltung);
            await _veranstaltungRepository.SaveChangesAsync();

            var veranstaltungDto = MapToDto(veranstaltung);
            return CreatedAtAction(nameof(GetById), new { id = veranstaltung.Id }, veranstaltungDto);
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
    [ProducesResponseType(typeof(VeranstaltungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungDto>> Update(int id, [FromBody] CreateVeranstaltungDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id);
            if (veranstaltung == null)
            {
                return NotFound($"Veranstaltung with ID {id} not found");
            }

            // Validate dates
            if (updateDto.Enddatum.HasValue && updateDto.Enddatum <= updateDto.Startdatum)
            {
                return BadRequest("End date must be after start date");
            }

            MapFromCreateDto(updateDto, veranstaltung);

            await _veranstaltungRepository.UpdateAsync(veranstaltung);
            await _veranstaltungRepository.SaveChangesAsync();

            var veranstaltungDto = MapToDto(veranstaltung);
            return Ok(veranstaltungDto);
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
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(id);
            if (veranstaltung == null)
            {
                return NotFound($"Veranstaltung with ID {id} not found");
            }

            // Soft delete: Set DeletedFlag and audit fields
            veranstaltung.DeletedFlag = true;
            veranstaltung.Aktiv = false;
            veranstaltung.Modified = DateTime.UtcNow;
            veranstaltung.ModifiedBy = GetCurrentUserId();

            await _veranstaltungRepository.UpdateAsync(veranstaltung);
            await _veranstaltungRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Veranstaltung with ID {Id}", id);
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

    private VeranstaltungDto MapToDto(Veranstaltung veranstaltung)
    {
        return new VeranstaltungDto
        {
            Id = veranstaltung.Id,
            VereinId = veranstaltung.VereinId,
            Titel = veranstaltung.Titel,
            Beschreibung = veranstaltung.Beschreibung,
            Startdatum = veranstaltung.Startdatum,
            Enddatum = veranstaltung.Enddatum,
            Ort = veranstaltung.Ort,
            NurFuerMitglieder = veranstaltung.NurFuerMitglieder,
            MaxTeilnehmer = veranstaltung.MaxTeilnehmer,
            AnmeldeErforderlich = veranstaltung.AnmeldeErforderlich,
            Preis = veranstaltung.Preis,
            WaehrungId = veranstaltung.WaehrungId,
            Aktiv = veranstaltung.Aktiv,
            Created = veranstaltung.Created,
            CreatedBy = veranstaltung.CreatedBy,
            Modified = veranstaltung.Modified,
            ModifiedBy = veranstaltung.ModifiedBy,
            DeletedFlag = veranstaltung.DeletedFlag
        };
    }

    private Veranstaltung MapFromCreateDto(CreateVeranstaltungDto createDto)
    {
        return new Veranstaltung
        {
            VereinId = createDto.VereinId,
            Titel = createDto.Titel,
            Beschreibung = createDto.Beschreibung,
            Startdatum = createDto.Startdatum,
            Enddatum = createDto.Enddatum,
            Ort = createDto.Ort,
            NurFuerMitglieder = createDto.NurFuerMitglieder,
            MaxTeilnehmer = createDto.MaxTeilnehmer,
            AnmeldeErforderlich = createDto.AnmeldeErforderlich,
            Preis = createDto.Preis,
            WaehrungId = createDto.WaehrungId,
            // Audit fields set automatically by system
            Created = DateTime.UtcNow,
            CreatedBy = GetCurrentUserId(),
            DeletedFlag = false,
            Aktiv = true
        };
    }

    private void MapFromCreateDto(CreateVeranstaltungDto updateDto, Veranstaltung veranstaltung)
    {
        veranstaltung.VereinId = updateDto.VereinId;
        veranstaltung.Titel = updateDto.Titel;
        veranstaltung.Beschreibung = updateDto.Beschreibung;
        veranstaltung.Startdatum = updateDto.Startdatum;
        veranstaltung.Enddatum = updateDto.Enddatum;
        veranstaltung.Ort = updateDto.Ort;
        veranstaltung.NurFuerMitglieder = updateDto.NurFuerMitglieder;
        veranstaltung.MaxTeilnehmer = updateDto.MaxTeilnehmer;
        veranstaltung.AnmeldeErforderlich = updateDto.AnmeldeErforderlich;
        veranstaltung.Preis = updateDto.Preis;
        veranstaltung.WaehrungId = updateDto.WaehrungId;
        // Audit fields set automatically by system
        veranstaltung.Modified = DateTime.UtcNow;
        veranstaltung.ModifiedBy = GetCurrentUserId();
    }

    #endregion
}
