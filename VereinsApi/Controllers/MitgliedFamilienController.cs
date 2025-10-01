using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Mitglied;
using VereinsApi.DTOs.MitgliedFamilie;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;
using VereinsApi.Models;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Mitglied Familie (Member Family Relationships)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MitgliedFamilienController : ControllerBase
{
    private readonly IMitgliedFamilieService _mitgliedFamilieService;
    private readonly ILogger<MitgliedFamilienController> _logger;

    public MitgliedFamilienController(
        IMitgliedFamilieService mitgliedFamilieService,
        ILogger<MitgliedFamilienController> logger)
    {
        _mitgliedFamilieService = mitgliedFamilieService;
        _logger = logger;
    }

    /// <summary>
    /// Get all family relationships with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<MitgliedFamilieDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PagedResult<MitgliedFamilieDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _mitgliedFamilieService.GetPagedAsync(pageNumber, pageSize, false, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting paginated family relationships");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get family relationship by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MitgliedFamilieDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedFamilieDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var relationship = await _mitgliedFamilieService.GetByIdAsync(id, cancellationToken);
            if (relationship == null)
            {
                return NotFound($"Family relationship with ID {id} not found");
            }
            return Ok(relationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting family relationship with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get family relationships by Mitglied ID
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedFamilieDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedFamilieDto>>> GetByMitglied(
        int mitgliedId,
        [FromQuery] bool activeOnly = true,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var relationships = await _mitgliedFamilieService.GetByMitgliedIdAsync(mitgliedId, !activeOnly, cancellationToken);
            return Ok(relationships);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting family relationships for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get children of a Mitglied
    /// </summary>
    [HttpGet("mitglied/{parentMitgliedId:int}/children")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedDto>>> GetChildren(
        int parentMitgliedId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var children = await _mitgliedFamilieService.GetChildrenAsync(parentMitgliedId, cancellationToken);
            return Ok(children);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting children for Mitglied {ParentMitgliedId}", parentMitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get parents of a Mitglied
    /// </summary>
    [HttpGet("mitglied/{childMitgliedId:int}/parents")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedDto>>> GetParents(
        int childMitgliedId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var parents = await _mitgliedFamilieService.GetParentsAsync(childMitgliedId, cancellationToken);
            return Ok(parents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting parents for Mitglied {ChildMitgliedId}", childMitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get siblings of a Mitglied
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}/siblings")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<MitgliedDto>>> GetSiblings(
        int mitgliedId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var siblings = await _mitgliedFamilieService.GetSiblingsAsync(mitgliedId, cancellationToken);
            return Ok(siblings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting siblings for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get family tree for a Mitglied
    /// </summary>
    [HttpGet("mitglied/{mitgliedId:int}/family-tree")]
    [ProducesResponseType(typeof(FamilyTree), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<FamilyTree>> GetFamilyTree(
        int mitgliedId,
        [FromQuery] int maxDepth = 3,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var familyTree = await _mitgliedFamilieService.GetFamilyTreeAsync(mitgliedId, maxDepth, cancellationToken);
            return Ok(familyTree);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting family tree for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new family relationship
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MitgliedFamilieDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedFamilieDto>> Create(
        [FromBody] CreateMitgliedFamilieDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = await _mitgliedFamilieService.ValidateCreateAsync(createDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var relationship = await _mitgliedFamilieService.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = relationship.Id }, relationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating family relationship");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update existing family relationship
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(MitgliedFamilieDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<MitgliedFamilieDto>> Update(
        int id,
        [FromBody] UpdateMitgliedFamilieDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var validationResult = await _mitgliedFamilieService.ValidateUpdateAsync(id, updateDto, cancellationToken);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var relationship = await _mitgliedFamilieService.UpdateAsync(id, updateDto, cancellationToken);
            if (relationship == null)
            {
                return NotFound($"Family relationship with ID {id} not found");
            }
            return Ok(relationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating family relationship with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete family relationship (soft delete)
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _mitgliedFamilieService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting family relationship with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get family statistics for a Mitglied
    /// </summary>
    [HttpGet("statistics/mitglied/{mitgliedId:int}")]
    [ProducesResponseType(typeof(FamilyStatistics), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<FamilyStatistics>> GetFamilyStatistics(
        int mitgliedId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var statistics = await _mitgliedFamilieService.GetFamilyStatisticsAsync(mitgliedId, cancellationToken);
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting family statistics for Mitglied {MitgliedId}", mitgliedId);
            return StatusCode(500, "Internal server error");
        }
    }
}


