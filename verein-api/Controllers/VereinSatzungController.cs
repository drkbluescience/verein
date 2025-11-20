using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.VereinSatzung;
using VereinsApi.Services;
using VereinsApi.Attributes;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Verein statute versions
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VereinSatzungController : ControllerBase
{
    private readonly IVereinSatzungService _service;
    private readonly ILogger<VereinSatzungController> _logger;

    public VereinSatzungController(
        IVereinSatzungService service,
        ILogger<VereinSatzungController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all statute versions for a specific Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(IEnumerable<VereinSatzungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinSatzungDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var satzungen = await _service.GetByVereinIdAsync(vereinId);
            return Ok(satzungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statute versions for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get active statute for a specific Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/active")]
    [RequireVereinAccess]
    [ProducesResponseType(typeof(VereinSatzungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinSatzungDto>> GetActiveByVereinId(int vereinId)
    {
        try
        {
            var satzung = await _service.GetActiveByVereinIdAsync(vereinId);
            if (satzung == null)
            {
                return NotFound();
            }
            return Ok(satzung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active statute for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get statute by ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(VereinSatzungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinSatzungDto>> GetById(int id)
    {
        try
        {
            var satzung = await _service.GetByIdAsync(id);
            if (satzung == null)
            {
                return NotFound();
            }
            return Ok(satzung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting statute {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Upload and create a new statute version
    /// </summary>
    [HttpPost("upload/{vereinId}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VereinSatzungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<VereinSatzungDto>> UploadSatzung(
        int vereinId,
        IFormFile file,
        [FromForm] DateTime satzungVom,
        [FromForm] bool setAsActive = true,
        [FromForm] string? bemerkung = null)
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

            var satzungDto = await _service.UploadSatzungAsync(
                vereinId,
                fileContent,
                file.FileName,
                file.ContentType,
                satzungVom,
                setAsActive,
                bemerkung);

            return CreatedAtAction(nameof(GetById), new { id = satzungDto.Id }, satzungDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while uploading statute for Verein {VereinId}", vereinId);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading statute for Verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Download statute file
    /// </summary>
    [HttpGet("{id}/download")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadSatzung(int id)
    {
        try
        {
            var fileData = await _service.GetFileAsync(id);

            if (fileData == null)
            {
                return NotFound("Statute file not found");
            }

            return File(fileData.Value.content, fileData.Value.contentType, fileData.Value.fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading statute {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing statute
    /// </summary>
    [HttpPut("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(typeof(VereinSatzungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinSatzungDto>> Update(int id, [FromBody] UpdateVereinSatzungDto updateDto)
    {
        try
        {
            var satzung = await _service.UpdateAsync(id, updateDto);
            return Ok(satzung);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating statute {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Set a statute version as active
    /// </summary>
    [HttpPost("{id}/set-active")]
    [RequireAdminOrDernek]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetActive(int id)
    {
        try
        {
            var result = await _service.SetActiveAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return Ok(new { message = "Statute version set as active" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting statute {Id} as active", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a statute (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    [RequireAdminOrDernek]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting statute {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

