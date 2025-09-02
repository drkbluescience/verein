using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.VeranstaltungBild;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing VeranstaltungBilder (Event Images)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VeranstaltungBilderController : ControllerBase
{
    private readonly IRepository<VeranstaltungBild> _bildRepository;
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly ILogger<VeranstaltungBilderController> _logger;
    private readonly IWebHostEnvironment _environment;

    public VeranstaltungBilderController(
        IRepository<VeranstaltungBild> bildRepository,
        IRepository<Veranstaltung> veranstaltungRepository,
        ILogger<VeranstaltungBilderController> logger,
        IWebHostEnvironment environment)
    {
        _bildRepository = bildRepository;
        _veranstaltungRepository = veranstaltungRepository;
        _logger = logger;
        _environment = environment;
    }

    /// <summary>
    /// Get all VeranstaltungBilder
    /// </summary>
    /// <returns>List of all VeranstaltungBilder</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungBildDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungBildDto>>> GetAll()
    {
        try
        {
            var bilder = await _bildRepository.GetAllAsync();
            var bildDtos = bilder.Select(b => MapToDto(b)).OrderBy(b => b.VeranstaltungId).ThenBy(b => b.Reihenfolge);

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
    [ProducesResponseType(typeof(VeranstaltungBildDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VeranstaltungBildDto>> GetById(int id)
    {
        try
        {
            var bild = await _bildRepository.GetByIdAsync(id);
            if (bild == null)
            {
                return NotFound($"VeranstaltungBild with ID {id} not found");
            }

            var bildDto = MapToDto(bild);
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
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungBildDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VeranstaltungBildDto>>> GetByVeranstaltungId(int veranstaltungId)
    {
        try
        {
            var bilder = await _bildRepository.GetAsync(b => b.VeranstaltungId == veranstaltungId);
            var bildDtos = bilder.Select(b => MapToDto(b)).OrderBy(b => b.Reihenfolge);

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
            // Validate file
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Check if Veranstaltung exists
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId);
            if (veranstaltung == null)
            {
                return BadRequest($"Veranstaltung with ID {veranstaltungId} not found");
            }

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Only JPG, PNG, GIF, and WebP files are allowed");
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest("File size cannot exceed 5MB");
            }

            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "veranstaltungen");
            Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var fileName = $"{veranstaltungId}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create VeranstaltungBild entity
            var bild = new VeranstaltungBild
            {
                VeranstaltungId = veranstaltungId,
                BildPfad = $"/uploads/veranstaltungen/{fileName}",
                Titel = titel,
                Reihenfolge = reihenfolge
            };

            await _bildRepository.AddAsync(bild);
            await _bildRepository.SaveChangesAsync();

            var bildDto = MapToDto(bild);
            return CreatedAtAction(nameof(GetById), new { id = bild.Id }, bildDto);
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

            // Check if Veranstaltung exists
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(createDto.VeranstaltungId);
            if (veranstaltung == null)
            {
                return BadRequest($"Veranstaltung with ID {createDto.VeranstaltungId} not found");
            }

            var bild = MapFromCreateDto(createDto);

            await _bildRepository.AddAsync(bild);
            await _bildRepository.SaveChangesAsync();

            var bildDto = MapToDto(bild);
            return CreatedAtAction(nameof(GetById), new { id = bild.Id }, bildDto);
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

            var bild = await _bildRepository.GetByIdAsync(id);
            if (bild == null)
            {
                return NotFound($"VeranstaltungBild with ID {id} not found");
            }

            MapFromUpdateDto(updateDto, bild);

            await _bildRepository.UpdateAsync(bild);
            await _bildRepository.SaveChangesAsync();

            var bildDto = MapToDto(bild);
            return Ok(bildDto);
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
    [ProducesResponseType(typeof(IEnumerable<VeranstaltungBildDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<VeranstaltungBildDto>>> ReorderImages(
        int veranstaltungId, 
        [FromBody] Dictionary<int, int> sortOrders)
    {
        try
        {
            var bilder = await _bildRepository.GetAsync(b => b.VeranstaltungId == veranstaltungId);
            
            foreach (var bild in bilder)
            {
                if (sortOrders.ContainsKey(bild.Id))
                {
                    bild.Reihenfolge = sortOrders[bild.Id];
                    await _bildRepository.UpdateAsync(bild);
                }
            }

            await _bildRepository.SaveChangesAsync();

            var bildDtos = bilder.Select(b => MapToDto(b)).OrderBy(b => b.Reihenfolge);
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
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var bild = await _bildRepository.GetByIdAsync(id);
            if (bild == null)
            {
                return NotFound($"VeranstaltungBild with ID {id} not found");
            }

            // Soft delete: Set DeletedFlag and audit fields
            // Note: Physical file is kept for potential recovery
            bild.DeletedFlag = true;
            bild.Modified = DateTime.UtcNow;
            bild.ModifiedBy = GetCurrentUserId();

            await _bildRepository.UpdateAsync(bild);
            await _bildRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting VeranstaltungBild with ID {Id}", id);
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

    private VeranstaltungBildDto MapToDto(VeranstaltungBild bild)
    {
        return new VeranstaltungBildDto
        {
            Id = bild.Id,
            VeranstaltungId = bild.VeranstaltungId,
            BildPfad = bild.BildPfad,
            Reihenfolge = bild.Reihenfolge,
            Titel = bild.Titel,
            Created = bild.Created,
            CreatedBy = bild.CreatedBy,
            Modified = bild.Modified,
            ModifiedBy = bild.ModifiedBy,
            DeletedFlag = bild.DeletedFlag
        };
    }

    private VeranstaltungBild MapFromCreateDto(CreateVeranstaltungBildDto createDto)
    {
        return new VeranstaltungBild
        {
            VeranstaltungId = createDto.VeranstaltungId,
            BildPfad = createDto.BildPfad,
            Reihenfolge = createDto.Reihenfolge,
            Titel = createDto.Titel,
            // Audit fields set automatically by system
            Created = DateTime.UtcNow,
            CreatedBy = GetCurrentUserId(),
            DeletedFlag = false
        };
    }

    private void MapFromCreateDto(CreateVeranstaltungBildDto updateDto, VeranstaltungBild bild)
    {
        bild.VeranstaltungId = updateDto.VeranstaltungId;
        bild.BildPfad = updateDto.BildPfad;
        bild.Reihenfolge = updateDto.Reihenfolge;
        bild.Titel = updateDto.Titel;
        // Audit fields set automatically by system
        bild.Modified = DateTime.UtcNow;
        bild.ModifiedBy = GetCurrentUserId();
    }

    private void MapFromUpdateDto(UpdateVeranstaltungBildDto updateDto, VeranstaltungBild bild)
    {
        if (!string.IsNullOrEmpty(updateDto.BildPfad))
            bild.BildPfad = updateDto.BildPfad;

        if (updateDto.Reihenfolge.HasValue)
            bild.Reihenfolge = updateDto.Reihenfolge.Value;

        if (updateDto.Titel != null)
            bild.Titel = updateDto.Titel;

        // Audit fields set automatically by system
        bild.Modified = DateTime.UtcNow;
        bild.ModifiedBy = GetCurrentUserId();
    }

    #endregion
}
