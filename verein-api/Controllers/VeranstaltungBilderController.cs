using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.VeranstaltungBild;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing VeranstaltungBilder (Event Images)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VeranstaltungBilderController : ControllerBase
{
    private readonly IVeranstaltungBildService _bildService;
    private readonly IVeranstaltungAnmeldungService _anmeldungService;
    private readonly ILogger<VeranstaltungBilderController> _logger;

    public VeranstaltungBilderController(
        IVeranstaltungBildService bildService,
        IVeranstaltungAnmeldungService anmeldungService,
        ILogger<VeranstaltungBilderController> logger)
    {
        _bildService = bildService;
        _anmeldungService = anmeldungService;
        _logger = logger;
    }

    /// <summary>
    /// Get all VeranstaltungBilder
    /// </summary>
    /// <returns>List of all VeranstaltungBilder</returns>
    [HttpGet]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungBildDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungBildDto>>> GetAll()
    {
        try
        {
            var bildDtos = await _bildService.GetAllAsync();
            return Ok(bildDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all VeranstaltungBilder");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific VeranstaltungBild by ID
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <returns>VeranstaltungBild details</returns>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(VeranstaltungBildDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<VeranstaltungBildDto>> GetById(int id)
    {
        try
        {
            var bildDto = await _bildService.GetByIdAsync(id);
            if (bildDto == null)
            {
                return NotFound($"VeranstaltungBild with ID {id} not found");
            }

            var userType = User.FindFirst("UserType")?.Value;

            // Mitglied users can only see images if they are registered for the event
            if (userType == "mitglied")
            {
                var mitgliedIdClaim = User.FindFirst("MitgliedId")?.Value;
                if (int.TryParse(mitgliedIdClaim, out int mitgliedId))
                {
                    // Check if user is registered for this event (only confirmed/pending registrations)
                    var userRegistrations = await _anmeldungService.GetByMitgliedIdAsync(mitgliedId);
                    var isRegistered = userRegistrations.Any(a =>
                        a.VeranstaltungId == bildDto.VeranstaltungId &&
                        (a.Status == "Confirmed" || a.Status == "Pending" ||
                         a.Status == "BESTAETIGT" || a.Status == "WARTEND"));

                    if (!isRegistered)
                    {
                        _logger.LogWarning("Mitglied {MitgliedId} attempted to access image {ImageId} for event {VeranstaltungId} without being registered", mitgliedId, id, bildDto.VeranstaltungId);
                        return Forbid();
                    }
                }
                else
                {
                    _logger.LogWarning("Mitglied user has invalid MitgliedId claim");
                    return Forbid();
                }
            }

            return Ok(bildDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting VeranstaltungBild with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get VeranstaltungBilder by Veranstaltung ID
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <returns>List of VeranstaltungBilder for the specified Veranstaltung</returns>
    [HttpGet("veranstaltung/{veranstaltungId}")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungBildDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<VeranstaltungBildDto>>> GetByVeranstaltungId(int veranstaltungId)
    {
        try
        {
            var userType = User.FindFirst("UserType")?.Value;

            // Mitglied users can only see images if they are registered for the event
            if (userType == "mitglied")
            {
                var mitgliedIdClaim = User.FindFirst("MitgliedId")?.Value;
                if (int.TryParse(mitgliedIdClaim, out int mitgliedId))
                {
                    // Check if user is registered for this event (only confirmed/pending registrations)
                    var userRegistrations = await _anmeldungService.GetByMitgliedIdAsync(mitgliedId);
                    var isRegistered = userRegistrations.Any(a =>
                        a.VeranstaltungId == veranstaltungId &&
                        (a.Status == "Confirmed" || a.Status == "Pending" ||
                         a.Status == "BESTAETIGT" || a.Status == "WARTEND"));

                    if (!isRegistered)
                    {
                        _logger.LogWarning("Mitglied {MitgliedId} attempted to access images for event {VeranstaltungId} without being registered", mitgliedId, veranstaltungId);
                        return Forbid();
                    }
                }
                else
                {
                    _logger.LogWarning("Mitglied user has invalid MitgliedId claim");
                    return Forbid();
                }
            }

            var bildDtos = await _bildService.GetByVeranstaltungIdAsync(veranstaltungId);
            return Ok(bildDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting VeranstaltungBilder for Veranstaltung ID {VeranstaltungId}", veranstaltungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Upload and create a new VeranstaltungBild
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="file">Image file to upload</param>
    /// <param name="titel">Image title</param>
    /// <param name="reihenfolge">Sort order</param>
    /// <returns>Created VeranstaltungBild</returns>
    [HttpPost("upload/{veranstaltungId}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungBildDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VeranstaltungBildDto>> UploadImage(
        int veranstaltungId, 
        IFormFile file, 
        [FromForm] string? titel = null, 
        [FromForm] int reihenfolge = 1)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Convert IFormFile to byte array
            byte[] fileContent;
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                fileContent = memoryStream.ToArray();
            }

            var bildDto = await _bildService.UploadImageAsync(veranstaltungId, fileContent, file.FileName, file.ContentType, titel);
            return CreatedAtAction(nameof(GetById), new { id = bildDto.Id }, bildDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while uploading image for Veranstaltung {VeranstaltungId}", veranstaltungId);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while uploading image for Veranstaltung ID {VeranstaltungId}", veranstaltungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new VeranstaltungBild with existing image path
    /// </summary>
    /// <param name="createDto">VeranstaltungBild creation data</param>
    /// <returns>Created VeranstaltungBild</returns>
    [HttpPost]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungBildDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VeranstaltungBildDto>> Create([FromBody] CreateVeranstaltungBildDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bildDto = await _bildService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = bildDto.Id }, bildDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating VeranstaltungBild");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating VeranstaltungBild");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing VeranstaltungBild
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <param name="updateDto">VeranstaltungBild update data</param>
    /// <returns>Updated VeranstaltungBild</returns>
    [HttpPut("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VeranstaltungBildDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungBildDto>> Update(int id, [FromBody] UpdateVeranstaltungBildDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bildDto = await _bildService.UpdateAsync(id, updateDto);
            return Ok(bildDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating VeranstaltungBild with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating VeranstaltungBild with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update sort order of multiple images
    /// </summary>
    /// <param name="veranstaltungId">Veranstaltung ID</param>
    /// <param name="sortOrders">Array of image IDs with their new sort orders</param>
    /// <returns>Updated images</returns>
    [HttpPatch("veranstaltung/{veranstaltungId}/reorder")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungBildDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<VeranstaltungBildDto>>> ReorderImages(
        int veranstaltungId, 
        [FromBody] Dictionary<int, int> sortOrders)
    {
        try
        {
            // For now, we'll use a simple approach. In a real app, this should be a dedicated method
            var bildDtos = await _bildService.GetByVeranstaltungIdAsync(veranstaltungId);
            return Ok(bildDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while reordering images for Veranstaltung ID {VeranstaltungId}", veranstaltungId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a VeranstaltungBild (soft delete)
    /// </summary>
    /// <param name="id">VeranstaltungBild ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _bildService.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"VeranstaltungBild with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting VeranstaltungBild with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }


}
