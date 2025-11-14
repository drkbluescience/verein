using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VereinsApi.Attributes;
using VereinsApi.DTOs.PageNote;
using VereinsApi.Domain.Enums;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Page Notes
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class PageNotesController : ControllerBase
{
    private readonly IPageNoteService _pageNoteService;
    private readonly ILogger<PageNotesController> _logger;

    public PageNotesController(
        IPageNoteService pageNoteService,
        ILogger<PageNotesController> logger)
    {
        _pageNoteService = pageNoteService;
        _logger = logger;
    }

    /// <summary>
    /// Get all page notes (Admin only)
    /// </summary>
    /// <returns>List of all page notes</returns>
    [HttpGet]
    [RequireAdmin]
    [ProducesResponseType(typeof(IEnumerable<PageNoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PageNoteDto>>> GetAll()
    {
        try
        {
            _logger.LogInformation("🔍 GetAll called - User authenticated: {IsAuth}", User.Identity?.IsAuthenticated);
            _logger.LogInformation("👤 User claims: {Claims}", string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}")));

            var notes = await _pageNoteService.GetAllAsync();

            _logger.LogInformation("✅ Returning {Count} notes", notes.Count());
            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error occurred while getting all page notes");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific page note by ID
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <returns>Page note details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PageNoteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PageNoteDto>> GetById(int id)
    {
        try
        {
            var note = await _pageNoteService.GetByIdAsync(id);
            if (note == null)
            {
                return NotFound($"Page note with ID {id} not found");
            }

            // Check if user is admin or owner of the note
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && note.UserEmail != userEmail)
            {
                return Forbid();
            }

            return Ok(note);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting page note with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get current user's notes
    /// </summary>
    /// <returns>List of current user's page notes</returns>
    [HttpGet("my-notes")]
    [ProducesResponseType(typeof(IEnumerable<PageNoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PageNoteDto>>> GetMyNotes()
    {
        try
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var userType = User.FindFirst("UserType")?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User email not found");
            }

            _logger.LogInformation($"GetMyNotes called by user: {userEmail}, userType: {userType}");
            var allNotes = await _pageNoteService.GetByUserEmailAsync(userEmail);

            // Filter by both email AND userType to prevent cross-user-type access
            var notes = allNotes.Where(n =>
                n.UserEmail == userEmail &&
                (string.IsNullOrEmpty(n.UserType) || n.UserType == userType)
            ).ToList();

            _logger.LogInformation($"GetMyNotes returning {notes.Count} notes for user: {userEmail}, userType: {userType}");

            // Log each note's owner for debugging
            foreach (var note in notes)
            {
                _logger.LogInformation($"Note ID: {note.Id}, Owner: {note.UserEmail}, UserType: {note.UserType}, Title: {note.Title}");
            }

            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting user's page notes");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get notes by page URL
    /// </summary>
    /// <param name="pageUrl">Page URL</param>
    /// <returns>List of page notes for the specified page</returns>
    [HttpGet("page")]
    [ProducesResponseType(typeof(IEnumerable<PageNoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PageNoteDto>>> GetByPageUrl([FromQuery] string pageUrl)
    {
        try
        {
            if (string.IsNullOrEmpty(pageUrl))
            {
                return BadRequest("Page URL is required");
            }

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var notes = await _pageNoteService.GetByPageUrlAsync(pageUrl);

            // Filter notes: admin sees all, users see only their own
            if (!isAdmin)
            {
                notes = notes.Where(n => n.UserEmail == userEmail);
            }

            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting page notes for URL {PageUrl}", pageUrl);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get notes by entity type and ID
    /// </summary>
    /// <param name="entityType">Entity type (Verein, Mitglied, etc.)</param>
    /// <param name="entityId">Entity ID</param>
    /// <returns>List of page notes for the specified entity</returns>
    [HttpGet("entity/{entityType}/{entityId}")]
    [ProducesResponseType(typeof(IEnumerable<PageNoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PageNoteDto>>> GetByEntity(string entityType, int entityId)
    {
        try
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var notes = await _pageNoteService.GetByEntityAsync(entityType, entityId);

            // Filter notes: admin sees all, users see only their own
            if (!isAdmin)
            {
                notes = notes.Where(n => n.UserEmail == userEmail);
            }

            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting page notes for entity {EntityType}/{EntityId}", entityType, entityId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get notes by status (Admin only)
    /// </summary>
    /// <param name="status">Note status</param>
    /// <returns>List of page notes with the specified status</returns>
    [HttpGet("status/{status}")]
    [RequireAdmin]
    [ProducesResponseType(typeof(IEnumerable<PageNoteDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PageNoteDto>>> GetByStatus(PageNoteStatus status)
    {
        try
        {
            var notes = await _pageNoteService.GetByStatusAsync(status);
            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting page notes by status {Status}", status);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get note statistics (Admin only)
    /// </summary>
    /// <returns>Note statistics</returns>
    [HttpGet("statistics")]
    [RequireAdmin]
    [ProducesResponseType(typeof(PageNoteStatisticsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<PageNoteStatisticsDto>> GetStatistics()
    {
        try
        {
            var stats = await _pageNoteService.GetStatisticsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting page note statistics");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new page note
    /// </summary>
    /// <param name="createDto">Page note creation data</param>
    /// <returns>Created page note</returns>
    [HttpPost]
    [ProducesResponseType(typeof(PageNoteDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PageNoteDto>> Create([FromBody] CreatePageNoteDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var userType = User.FindFirst("UserType")?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User email not found");
            }

            var note = await _pageNoteService.CreateAsync(createDto, userEmail, userName, userType);
            return CreatedAtAction(nameof(GetById), new { id = note.Id }, note);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating page note");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing page note
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <param name="updateDto">Update data</param>
    /// <returns>Updated page note</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PageNoteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<PageNoteDto>> Update(int id, [FromBody] UpdatePageNoteDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingNote = await _pageNoteService.GetByIdAsync(id);
            if (existingNote == null)
            {
                return NotFound($"Page note with ID {id} not found");
            }

            // Check if user is owner of the note
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (existingNote.UserEmail != userEmail)
            {
                return Forbid();
            }

            var note = await _pageNoteService.UpdateAsync(id, updateDto);
            return Ok(note);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Page note with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating page note with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a page note
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var existingNote = await _pageNoteService.GetByIdAsync(id);
            if (existingNote == null)
            {
                return NotFound($"Page note with ID {id} not found");
            }

            // Check if user is admin or owner of the note
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && existingNote.UserEmail != userEmail)
            {
                return Forbid();
            }

            await _pageNoteService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting page note with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Complete a page note (Admin only)
    /// </summary>
    /// <param name="id">Page note ID</param>
    /// <param name="completeDto">Completion data</param>
    /// <returns>Updated page note</returns>
    [HttpPatch("{id}/complete")]
    [RequireAdmin]
    [ProducesResponseType(typeof(PageNoteDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PageNoteDto>> Complete(int id, [FromBody] CompletePageNoteDto completeDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(adminEmail))
            {
                return Unauthorized("Admin email not found");
            }

            var note = await _pageNoteService.CompleteNoteAsync(id, completeDto, adminEmail);
            return Ok(note);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Page note with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while completing page note with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}

