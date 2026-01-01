using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.MitgliedAdresse;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Mitglieder (Members)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize] // Require authentication for all endpoints
public class MitgliederController : ControllerBase
{
    private readonly IMitgliedService _mitgliedService;
    private readonly ILogger<MitgliederController> _logger;

    public MitgliederController(
        IMitgliedService mitgliedService,
        ILogger<MitgliederController> logger)
    {
        _mitgliedService = mitgliedService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Mitglieder with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<MitgliedDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PagedResult<MitgliedDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _mitgliedService.GetPagedAsync(pageNumber, pageSize, false, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting paginated Mitglieder");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Mitglied by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var mitglied = await _mitgliedService.GetByIdAsync(id, cancellationToken);
            if (mitglied == null)
            {
                return NotFound($"Mitglied with ID {id} not found");
            }
            return Ok(mitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Mitglied with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Mitglieder by Verein ID
    /// </summary>
    [HttpGet("verein/{vereinId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedDto>>> GetByVerein(
        int vereinId,
        [FromQuery] bool activeOnly = true,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var mitglieder = await _mitgliedService.GetByVereinIdAsync(vereinId, !activeOnly, cancellationToken);
            return Ok(mitglieder);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Mitglieder for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Search Mitglieder by name
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedDto>>> SearchByName(
        [FromQuery] string searchTerm,
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest("Search term is required");
            }

            var mitglieder = await _mitgliedService.SearchByNameAsync(searchTerm, null, vereinId, cancellationToken);
            return Ok(mitglieder);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching Mitglieder with term '{SearchTerm}'", searchTerm);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new Mitglied
    /// </summary>
    [HttpPost]
    [RequireAdminOrDernek] // Only Admin or Dernek can create members
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedDto>> Create(
        [FromBody] CreateMitgliedDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = await _mitgliedService.ValidateCreateAsync(createDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var mitglied = await _mitgliedService.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = mitglied.Id }, mitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Mitglied");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update existing Mitglied
    /// </summary>
    [HttpPut("{id:int}")]
    [RequireAdminOrDernek] // Only Admin or Dernek can update members
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedDto>> Update(
        int id,
        [FromBody] UpdateMitgliedDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = await _mitgliedService.ValidateUpdateAsync(id, updateDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var mitglied = await _mitgliedService.UpdateAsync(id, updateDto, cancellationToken);
            if (mitglied == null)
            {
                return NotFound($"Mitglied with ID {id} not found");
            }

            return Ok(mitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Mitglied with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update limited fields for the currently authenticated member
    /// </summary>
    [HttpPut("{id:int}/self")]
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MitgliedDto>> UpdateSelf(
        int id,
        [FromBody] UpdateMitgliedSelfDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userType = User.FindFirst("UserType")?.Value;
            var claimMitgliedId = User.FindFirst("MitgliedId")?.Value;

            if (userType != "mitglied" || !int.TryParse(claimMitgliedId, out var tokenMitgliedId) || tokenMitgliedId != id)
            {
                return Forbid();
            }

            var existing = await _mitgliedService.GetByIdAsync(id, cancellationToken);
            if (existing == null)
            {
                return NotFound($"Mitglied with ID {id} not found");
            }

            string? NormalizeOptional(string? value, string? fallback)
            {
                if (value == null)
                {
                    return fallback;
                }

                return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
            }

            var updatedDto = new UpdateMitgliedDto
            {
                Id = existing.Id,
                VereinId = existing.VereinId,
                Mitgliedsnummer = existing.Mitgliedsnummer,
                MitgliedStatusId = existing.MitgliedStatusId,
                MitgliedTypId = existing.MitgliedTypId,
                Vorname = existing.Vorname,
                Nachname = existing.Nachname,
                GeschlechtId = existing.GeschlechtId,
                Geburtsdatum = existing.Geburtsdatum,
                Geburtsort = existing.Geburtsort,
                StaatsangehoerigkeitId = existing.StaatsangehoerigkeitId,
                Email = NormalizeOptional(updateDto.Email, existing.Email),
                Telefon = NormalizeOptional(updateDto.Telefon, existing.Telefon),
                Mobiltelefon = NormalizeOptional(updateDto.Mobiltelefon, existing.Mobiltelefon),
                Eintrittsdatum = existing.Eintrittsdatum,
                Austrittsdatum = existing.Austrittsdatum,
                Bemerkung = existing.Bemerkung,
                BeitragBetrag = existing.BeitragBetrag,
                BeitragWaehrungId = existing.BeitragWaehrungId,
                BeitragPeriodeCode = NormalizeOptional(updateDto.BeitragPeriodeCode, existing.BeitragPeriodeCode),
                BeitragZahlungsTag = existing.BeitragZahlungsTag,
                BeitragZahlungstagTypCode = existing.BeitragZahlungstagTypCode,
                BeitragIstPflicht = existing.BeitragIstPflicht,
                Aktiv = existing.Aktiv
            };

            var updated = await _mitgliedService.UpdateAsync(id, updatedDto, cancellationToken);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating member profile {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete Mitglied (soft delete)
    /// </summary>
    [HttpDelete("{id:int}")]
    [RequireAdminOrDernek] // Only Admin or Dernek can delete members
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _mitgliedService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Mitglied with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get membership statistics for a Verein
    /// </summary>
    [HttpGet("statistics/verein/{vereinId:int}")]
    [ProducesResponseType(typeof(MembershipStatistics), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MembershipStatistics>> GetMembershipStatistics(
        int vereinId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var statistics = await _mitgliedService.GetMembershipStatisticsAsync(vereinId, cancellationToken);
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting membership statistics for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new Mitglied with address in one transaction
    /// </summary>
    [HttpPost("with-address")]
    [RequireAdminOrDernek] // Only Admin or Dernek can create members
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedDto>> CreateWithAddress(
        [FromBody] CreateMitgliedWithAddressRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = await _mitgliedService.ValidateCreateAsync(request.Mitglied, cancellationToken);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var mitglied = await _mitgliedService.CreateWithAddressAsync(
                request.Mitglied,
                request.Adresse,
                cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = mitglied.Id }, mitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Mitglied with address");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Transfer Mitglied to another Verein
    /// </summary>
    [HttpPost("{id:int}/transfer")]
    [RequireAdminOrDernek] // Only Admin or Dernek can transfer members
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedDto>> Transfer(
        int id,
        [FromBody] TransferMitgliedRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mitglied = await _mitgliedService.TransferToVereinAsync(
                id,
                request.NewVereinId,
                request.TransferDate,
                cancellationToken);

            if (mitglied == null)
            {
                return NotFound($"Mitglied with ID {id} not found");
            }

            return Ok(mitglied);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while transferring Mitglied with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while transferring Mitglied with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Set active status for a Mitglied
    /// </summary>
    [HttpPost("{id:int}/set-active")]
    [RequireAdminOrDernek] // Only Admin or Dernek can change member status
    [ProducesResponseType(typeof(MitgliedDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedDto>> SetActiveStatus(
        int id,
        [FromBody] SetActiveStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mitglied = await _mitgliedService.SetActiveStatusAsync(
                id,
                request.IsActive,
                cancellationToken);

            if (mitglied == null)
            {
                return NotFound($"Mitglied with ID {id} not found");
            }

            return Ok(mitglied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while setting active status for Mitglied with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
