using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.KassenbuchJahresabschluss;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for KassenbuchJahresabschluss (Year-End Closing) operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KassenbuchJahresabschlussController : ControllerBase
{
    private readonly IKassenbuchJahresabschlussService _service;
    private readonly ILogger<KassenbuchJahresabschlussController> _logger;

    public KassenbuchJahresabschlussController(
        IKassenbuchJahresabschlussService service,
        ILogger<KassenbuchJahresabschlussController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all year-end closings
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<KassenbuchJahresabschlussDto>>> GetAll([FromQuery] bool includeDeleted = false)
    {
        var result = await _service.GetAllAsync(includeDeleted);
        return Ok(result);
    }

    /// <summary>
    /// Get year-end closing by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound($"Year-end closing with ID {id} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get year-end closings by Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    public async Task<ActionResult<IEnumerable<KassenbuchJahresabschlussDto>>> GetByVerein(int vereinId)
    {
        var result = await _service.GetByVereinIdAsync(vereinId);
        return Ok(result);
    }

    /// <summary>
    /// Get year-end closing for specific Verein and year
    /// </summary>
    [HttpGet("verein/{vereinId}/jahr/{jahr}")]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> GetByVereinAndJahr(int vereinId, int jahr)
    {
        var result = await _service.GetByVereinAndJahrAsync(vereinId, jahr);
        if (result == null)
            return NotFound($"Year-end closing for year {jahr} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get latest year-end closing for a Verein
    /// </summary>
    [HttpGet("verein/{vereinId}/latest")]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> GetLatest(int vereinId)
    {
        var result = await _service.GetLatestAsync(vereinId);
        if (result == null)
            return NotFound("No year-end closings found");
        return Ok(result);
    }

    /// <summary>
    /// Create a new year-end closing
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> Create([FromBody] CreateKassenbuchJahresabschlussDto createDto)
    {
        try
        {
            var result = await _service.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    /// <summary>
    /// Calculate and create year-end closing automatically
    /// </summary>
    [HttpPost("verein/{vereinId}/calculate/{jahr}")]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> CalculateAndCreate(int vereinId, int jahr)
    {
        try
        {
            var result = await _service.CalculateAndCreateAsync(vereinId, jahr);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing year-end closing
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> Update(int id, [FromBody] UpdateKassenbuchJahresabschlussDto updateDto)
    {
        if (id != updateDto.Id)
            return BadRequest("ID mismatch");

        try
        {
            var result = await _service.UpdateAsync(id, updateDto);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Year-end closing with ID {id} not found");
        }
    }

    /// <summary>
    /// Mark year-end closing as audited
    /// </summary>
    [HttpPost("{id}/audit")]
    public async Task<ActionResult<KassenbuchJahresabschlussDto>> MarkAsAudited(int id, [FromBody] string auditorName)
    {
        try
        {
            var result = await _service.MarkAsAuditedAsync(id, auditorName);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Year-end closing with ID {id} not found");
        }
    }

    /// <summary>
    /// Delete a year-end closing (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound($"Year-end closing with ID {id} not found");
        return NoContent();
    }
}

