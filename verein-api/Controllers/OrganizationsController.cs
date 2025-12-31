using Microsoft.AspNetCore.Mvc;
using VereinsApi.Attributes;
using VereinsApi.DTOs.Organization;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing organization hierarchy
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
[RequireAdmin]
public class OrganizationsController : ControllerBase
{
    private readonly IOrganizationService _service;
    private readonly ILogger<OrganizationsController> _logger;

    public OrganizationsController(IOrganizationService service, ILogger<OrganizationsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<OrganizationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OrganizationDto>>> GetAll(
        [FromQuery] string? orgType,
        [FromQuery] string? federationCode,
        [FromQuery] int? parentId,
        [FromQuery] bool includeDeleted = false)
    {
        try
        {
            var organizations = await _service.GetAllAsync(orgType, federationCode, parentId, includeDeleted);
            return Ok(organizations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting organizations");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(OrganizationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrganizationDto>> GetById(int id, [FromQuery] bool includeDeleted = false)
    {
        try
        {
            var organization = await _service.GetByIdAsync(id, includeDeleted);
            if (organization == null)
            {
                return NotFound($"Organization with ID {id} not found");
            }

            return Ok(organization);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting organization {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrganizationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrganizationDto>> Create([FromBody] OrganizationCreateDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var organization = await _service.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = organization.Id }, organization);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating organization");
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict while creating organization");
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating organization");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(OrganizationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrganizationDto>> Update(int id, [FromBody] OrganizationUpdateDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var organization = await _service.UpdateAsync(id, updateDto);
            return Ok(organization);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating organization {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict while updating organization {Id}", id);
            return Conflict(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Organization not found {Id}", id);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating organization {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _service.SoftDeleteAsync(id);
            if (!deleted)
            {
                return NotFound($"Organization with ID {id} not found");
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict while deleting organization {Id}", id);
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting organization {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id:int}/restore")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult> Restore(int id)
    {
        try
        {
            var restored = await _service.RestoreAsync(id);
            if (!restored)
            {
                return NotFound($"Organization with ID {id} not found");
            }

            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Conflict while restoring organization {Id}", id);
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while restoring organization {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id:int}/tree")]
    [ProducesResponseType(typeof(OrganizationTreeNodeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrganizationTreeNodeDto>> GetTree(int id, [FromQuery] bool includeDeleted = false)
    {
        try
        {
            var tree = await _service.GetTreeAsync(id, includeDeleted);
            return Ok(tree);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Tree root not found {Id}", id);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting tree for organization {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id:int}/path")]
    [ProducesResponseType(typeof(IEnumerable<OrganizationPathNodeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<IEnumerable<OrganizationPathNodeDto>>> GetPath(int id)
    {
        try
        {
            var path = await _service.GetPathAsync(id);
            return Ok(path);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Organization path not found {Id}", id);
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Organization path conflict {Id}", id);
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting path for organization {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
