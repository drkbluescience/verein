using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.MitgliedAdresse;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Mitglied Adressen (Member Addresses)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class MitgliedAdressenController : ControllerBase
{
    private readonly IMitgliedAdresseService _mitgliedAdresseService;
    private readonly ILogger<MitgliedAdressenController> _logger;

    public MitgliedAdressenController(
        IMitgliedAdresseService mitgliedAdresseService,
        ILogger<MitgliedAdressenController> logger)
    {
        _mitgliedAdresseService = mitgliedAdresseService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Mitglied addresses with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<MitgliedAdresseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PagedResult<MitgliedAdresseDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _mitgliedAdresseService.GetPagedAsync(pageNumber, pageSize, false, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting paginated Mitglied addresses");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get address by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MitgliedAdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedAdresseDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var adresse = await _mitgliedAdresseService.GetByIdAsync(id, cancellationToken);
            if (adresse == null)
            {
                return NotFound($"Address with ID {id} not found");
            }
            return Ok(adresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting address with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get addresses by Mitglied ID
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedAdresseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedAdresseDto>>> GetByMitglied(
        int mitgliedId,
        [FromQuery] bool activeOnly = true,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var adressen = await _mitgliedAdresseService.GetByMitgliedIdAsync(mitgliedId, !activeOnly, cancellationToken);
            return Ok(adressen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting addresses for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get standard address for a Mitglied
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}/standard")]
    [ProducesResponseType(typeof(MitgliedAdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedAdresseDto>> GetStandardAddress(
        int mitgliedId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var adresse = await _mitgliedAdresseService.GetStandardAddressAsync(mitgliedId, cancellationToken);
            if (adresse == null)
            {
                return NotFound($"No standard address found for Mitglied {mitgliedId}");
            }
            return Ok(adresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting standard address for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new address
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MitgliedAdresseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedAdresseDto>> Create(
        [FromBody] CreateMitgliedAdresseDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = await _mitgliedAdresseService.ValidateCreateAsync(createDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var adresse = await _mitgliedAdresseService.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = adresse.Id }, adresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating address");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update existing address
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(MitgliedAdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedAdresseDto>> Update(
        int id,
        [FromBody] UpdateMitgliedAdresseDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adresse = await _mitgliedAdresseService.UpdateAsync(id, updateDto, cancellationToken);
            if (adresse == null)
            {
                return NotFound($"Address with ID {id} not found");
            }
            return Ok(adresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating address with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete address (soft delete)
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _mitgliedAdresseService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting address with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Set address as standard address for a Mitglied
    /// </summary>
    [HttpPost("{mitgliedId:int}/address/{addressId:int}/set-standard")]
    [ProducesResponseType(typeof(MitgliedAdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedAdresseDto>> SetAsStandardAddress(
        int mitgliedId,
        int addressId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var adresse = await _mitgliedAdresseService.SetAsStandardAddressAsync(mitgliedId, addressId, cancellationToken);
            if (adresse == null)
            {
                return NotFound($"Address with ID {addressId} not found for Mitglied {mitgliedId}");
            }
            return Ok(adresse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while setting address {AddressId} as standard for Mitglied {MitgliedId}", addressId, mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get address statistics for a Mitglied
    /// </summary>
    [HttpGet("statistics/mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(AddressStatistics), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AddressStatistics>> GetAddressStatistics(
        int mitgliedId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var statistics = await _mitgliedAdresseService.GetAddressStatisticsAsync(mitgliedId, cancellationToken);
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting address statistics for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }
}


