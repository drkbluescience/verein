using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Association;
using VereinsApi.Services;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing associations (Vereine)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AssociationsController : ControllerBase
{
    private readonly IAssociationService _associationService;
    private readonly IMapper _mapper;
    private readonly ILogger<AssociationsController> _logger;

    public AssociationsController(
        IAssociationService associationService,
        IMapper mapper,
        ILogger<AssociationsController> logger)
    {
        _associationService = associationService ?? throw new ArgumentNullException(nameof(associationService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all associations
    /// </summary>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of associations</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AssociationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<AssociationDto>>> GetAllAssociations(
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Getting all associations. IncludeDeleted: {IncludeDeleted}", includeDeleted);
            
            var associations = await _associationService.GetAllAssociationsAsync(includeDeleted, cancellationToken);
            var associationDtos = _mapper.Map<IEnumerable<AssociationDto>>(associations);
            
            return Ok(associationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all associations");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Gets associations with pagination
    /// </summary>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="searchTerm">Optional search term</param>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of associations</returns>
    [HttpGet("paginated")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> GetPaginatedAssociations(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (page <= 0)
            {
                return BadRequest("Page number must be greater than 0");
            }

            if (pageSize <= 0 || pageSize > 100)
            {
                return BadRequest("Page size must be between 1 and 100");
            }

            _logger.LogInformation("Getting paginated associations. Page: {Page}, PageSize: {PageSize}, SearchTerm: {SearchTerm}", 
                page, pageSize, searchTerm);
            
            var (associations, totalCount) = await _associationService.GetPaginatedAssociationsAsync(
                page, pageSize, searchTerm, includeDeleted, cancellationToken);
            
            var associationDtos = _mapper.Map<IEnumerable<AssociationDto>>(associations);
            
            var result = new
            {
                Data = associationDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                HasNextPage = page * pageSize < totalCount,
                HasPreviousPage = page > 1
            };
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting paginated associations");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Gets an association by ID
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="includeDeleted">Whether to include soft-deleted associations</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association details</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(AssociationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AssociationDto>> GetAssociationById(
        int id,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Association ID must be greater than 0");
            }

            _logger.LogInformation("Getting association by ID: {Id}", id);
            
            var association = await _associationService.GetAssociationByIdAsync(id, includeDeleted, cancellationToken);
            
            if (association == null)
            {
                return NotFound($"Association with ID {id} not found");
            }
            
            var associationDto = _mapper.Map<AssociationDto>(association);
            return Ok(associationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting association by ID: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Gets an association by association number
    /// </summary>
    /// <param name="associationNumber">Association number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association details</returns>
    [HttpGet("by-number/{associationNumber}")]
    [ProducesResponseType(typeof(AssociationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AssociationDto>> GetAssociationByNumber(
        string associationNumber,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(associationNumber))
            {
                return BadRequest("Association number cannot be empty");
            }

            _logger.LogInformation("Getting association by number: {AssociationNumber}", associationNumber);
            
            var association = await _associationService.GetAssociationByNumberAsync(associationNumber, cancellationToken);
            
            if (association == null)
            {
                return NotFound($"Association with number {associationNumber} not found");
            }
            
            var associationDto = _mapper.Map<AssociationDto>(association);
            return Ok(associationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting association by number: {AssociationNumber}", associationNumber);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Gets an association by client code
    /// </summary>
    /// <param name="clientCode">Client code</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Association details</returns>
    [HttpGet("by-client-code/{clientCode}")]
    [ProducesResponseType(typeof(AssociationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AssociationDto>> GetAssociationByClientCode(
        string clientCode,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(clientCode))
            {
                return BadRequest("Client code cannot be empty");
            }

            _logger.LogInformation("Getting association by client code: {ClientCode}", clientCode);
            
            var association = await _associationService.GetAssociationByClientCodeAsync(clientCode, cancellationToken);
            
            if (association == null)
            {
                return NotFound($"Association with client code {clientCode} not found");
            }
            
            var associationDto = _mapper.Map<AssociationDto>(association);
            return Ok(associationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting association by client code: {ClientCode}", clientCode);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Searches associations by name
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of matching associations</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<AssociationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<AssociationDto>>> SearchAssociations(
        [FromQuery] string searchTerm,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest("Search term cannot be empty");
            }

            if (searchTerm.Length < 2)
            {
                return BadRequest("Search term must be at least 2 characters long");
            }

            _logger.LogInformation("Searching associations with term: {SearchTerm}", searchTerm);

            var associations = await _associationService.SearchAssociationsAsync(searchTerm, cancellationToken);
            var associationDtos = _mapper.Map<IEnumerable<AssociationDto>>(associations);

            return Ok(associationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching associations with term: {SearchTerm}", searchTerm);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Gets active associations only
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of active associations</returns>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<AssociationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<AssociationDto>>> GetActiveAssociations(
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Getting active associations");

            var associations = await _associationService.GetActiveAssociationsAsync(cancellationToken);
            var associationDtos = _mapper.Map<IEnumerable<AssociationDto>>(associations);

            return Ok(associationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting active associations");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Creates a new association
    /// </summary>
    /// <param name="createAssociationDto">Association data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created association</returns>
    [HttpPost]
    [ProducesResponseType(typeof(AssociationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AssociationDto>> CreateAssociation(
        [FromBody] CreateAssociationDto createAssociationDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (createAssociationDto == null)
            {
                return BadRequest("Association data is required");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Creating new association: {Name}", createAssociationDto.Name);

            var association = _mapper.Map<Association>(createAssociationDto);
            var createdAssociation = await _associationService.CreateAssociationAsync(association, cancellationToken);
            var associationDto = _mapper.Map<AssociationDto>(createdAssociation);

            return CreatedAtAction(
                nameof(GetAssociationById),
                new { id = associationDto.Id },
                associationDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating association");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating association");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Updates an existing association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="updateAssociationDto">Updated association data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated association</returns>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(AssociationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<AssociationDto>> UpdateAssociation(
        int id,
        [FromBody] UpdateAssociationDto updateAssociationDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Association ID must be greater than 0");
            }

            if (updateAssociationDto == null)
            {
                return BadRequest("Association data is required");
            }

            if (id != updateAssociationDto.Id)
            {
                return BadRequest("ID in URL does not match ID in request body");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Updating association: {Id} - {Name}", id, updateAssociationDto.Name);

            var association = _mapper.Map<Association>(updateAssociationDto);
            var updatedAssociation = await _associationService.UpdateAssociationAsync(association, cancellationToken);
            var associationDto = _mapper.Map<AssociationDto>(updatedAssociation);

            return Ok(associationDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating association: {Id}", id);

            if (ex.Message.Contains("not found"))
            {
                return NotFound(ex.Message);
            }

            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating association: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Soft deletes an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeleteAssociation(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Association ID must be greater than 0");
            }

            _logger.LogInformation("Soft deleting association: {Id}", id);

            await _associationService.DeleteAssociationAsync(id, cancellationToken);

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Association not found for deletion: {Id}", id);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting association: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Permanently deletes an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpDelete("{id:int}/hard")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> HardDeleteAssociation(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Association ID must be greater than 0");
            }

            _logger.LogInformation("Hard deleting association: {Id}", id);

            await _associationService.HardDeleteAssociationAsync(id, cancellationToken);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while hard deleting association: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Activates an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpPatch("{id:int}/activate")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> ActivateAssociation(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Association ID must be greater than 0");
            }

            _logger.LogInformation("Activating association: {Id}", id);

            await _associationService.ActivateAssociationAsync(id, cancellationToken);

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Association not found for activation: {Id}", id);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while activating association: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Deactivates an association
    /// </summary>
    /// <param name="id">Association ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content</returns>
    [HttpPatch("{id:int}/deactivate")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> DeactivateAssociation(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Association ID must be greater than 0");
            }

            _logger.LogInformation("Deactivating association: {Id}", id);

            await _associationService.DeactivateAssociationAsync(id, cancellationToken);

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Association not found for deactivation: {Id}", id);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deactivating association: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Checks if association number is unique
    /// </summary>
    /// <param name="associationNumber">Association number to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Uniqueness result</returns>
    [HttpGet("check-association-number/{associationNumber}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CheckAssociationNumberUniqueness(
        string associationNumber,
        [FromQuery] int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(associationNumber))
            {
                return BadRequest("Association number cannot be empty");
            }

            var isUnique = await _associationService.IsAssociationNumberUniqueAsync(associationNumber, excludeId, cancellationToken);

            return Ok(new { IsUnique = isUnique });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking association number uniqueness: {AssociationNumber}", associationNumber);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    /// <summary>
    /// Checks if client code is unique
    /// </summary>
    /// <param name="clientCode">Client code to check</param>
    /// <param name="excludeId">ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Uniqueness result</returns>
    [HttpGet("check-client-code/{clientCode}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> CheckClientCodeUniqueness(
        string clientCode,
        [FromQuery] int? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(clientCode))
            {
                return BadRequest("Client code cannot be empty");
            }

            var isUnique = await _associationService.IsClientCodeUniqueAsync(clientCode, excludeId, cancellationToken);

            return Ok(new { IsUnique = isUnique });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking client code uniqueness: {ClientCode}", clientCode);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }
}
