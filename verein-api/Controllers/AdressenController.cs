using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Adresse;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Adressen (Addresses)
/// </summary>
[ApiController] // API controller özelliklerini aktifleştirir
[Route("api/[controller]")] // base route
[Produces("application/json")] // JSON response döner
[Authorize] // Require authentication for all endpoints
// ControllerBase - API controller base class
public class AdressenController : ControllerBase
{
    private readonly IAdresseService _adresseService;
    private readonly ILogger<AdressenController> _logger;

    public AdressenController(
        IAdresseService adresseService,
        ILogger<AdressenController> logger)
    {
        _adresseService = adresseService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Adressen
    /// </summary>
    /// <returns>List of all Adressen</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AdresseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AdresseDto>>> GetAll()
    {
        try
        {
            var adresseDtos = await _adresseService.GetAllAsync();
            return Ok(adresseDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all Adressen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific Adresse by ID
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <returns>Adresse details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdresseDto>> GetById(int id)
    {
        try
        {
            var adresseDto = await _adresseService.GetByIdAsync(id);
            if (adresseDto == null)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            return Ok(adresseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Adresse with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Adressen by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <returns>List of Adressen for the specified Verein</returns>
    [HttpGet("verein/{vereinId}")]
    [ProducesResponseType(typeof(IEnumerable<AdresseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AdresseDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var adresseDtos = await _adresseService.GetByVereinIdAsync(vereinId);
            return Ok(adresseDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Adressen for Verein ID {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new Adresse
    /// </summary>
    /// <param name="createDto">Adresse creation data</param>
    /// <returns>Created Adresse</returns>
    [HttpPost]
    [RequireAdminOrDernek] // Only Admin or Dernek can create addresses
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AdresseDto>> Create([FromBody] CreateAdresseDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adresseDto = await _adresseService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = adresseDto.Id }, adresseDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating Adresse");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Adresse");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing Adresse
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <param name="updateDto">Adresse update data</param>
    /// <returns>Updated Adresse</returns>
    [HttpPut("{id}")]
    [RequireAdminOrDernek] // Only Admin or Dernek can update addresses
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdresseDto>> Update(int id, [FromBody] UpdateAdresseDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adresseDto = await _adresseService.UpdateAsync(id, updateDto);
            return Ok(adresseDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating Adresse with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Adresse with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete an Adresse (soft delete)
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [RequireAdminOrDernek] // Only Admin or Dernek can delete addresses
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _adresseService.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Adresse with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Set an Adresse as default for a Verein
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <returns>Updated Adresse</returns>
    [HttpPatch("{id}/set-default")]
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdresseDto>> SetAsDefault(int id)
    {
        try
        {
            // Get the address first to find the vereinId
            var address = await _adresseService.GetByIdAsync(id);
            if (address == null)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            var result = await _adresseService.SetAsStandardAddressAsync(address.VereinId ?? 0, id);
            if (!result)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            var adresseDto = await _adresseService.GetByIdAsync(id);
            return Ok(adresseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while setting Adresse with ID {Id} as default", id);
            return StatusCode(500, "Internal server error");
        }
    }


}
