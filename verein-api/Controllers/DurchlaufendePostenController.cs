using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.DurchlaufendePosten;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for DurchlaufendePosten (Transit Items) operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DurchlaufendePostenController : ControllerBase
{
    private readonly IDurchlaufendePostenService _service;
    private readonly ILogger<DurchlaufendePostenController> _logger;

    public DurchlaufendePostenController(IDurchlaufendePostenService service, ILogger<DurchlaufendePostenController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all transit items
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DurchlaufendePostenDto>>> GetAll([FromQuery] bool includeDeleted = false)
    {
        var result = await _service.GetAllAsync(includeDeleted);
        return Ok(result);
    }

    /// <summary>
    /// Get transit item by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DurchlaufendePostenDto>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound($"Transit item with ID {id} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get transit items by Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    public async Task<ActionResult<IEnumerable<DurchlaufendePostenDto>>> GetByVerein(int vereinId)
    {
        var result = await _service.GetByVereinIdAsync(vereinId);
        return Ok(result);
    }

    /// <summary>
    /// Get transit items by status
    /// </summary>
    [HttpGet("verein/{vereinId}/status/{status}")]
    public async Task<ActionResult<IEnumerable<DurchlaufendePostenDto>>> GetByStatus(int vereinId, string status)
    {
        var result = await _service.GetByStatusAsync(vereinId, status);
        return Ok(result);
    }

    /// <summary>
    /// Get open (not fully transferred) transit items
    /// </summary>
    [HttpGet("verein/{vereinId}/open")]
    public async Task<ActionResult<IEnumerable<DurchlaufendePostenDto>>> GetOpen(int vereinId)
    {
        var result = await _service.GetOpenAsync(vereinId);
        return Ok(result);
    }

    /// <summary>
    /// Get transit items by FiBuKonto
    /// </summary>
    [HttpGet("verein/{vereinId}/konto/{fiBuNummer}")]
    public async Task<ActionResult<IEnumerable<DurchlaufendePostenDto>>> GetByFiBuKonto(int vereinId, string fiBuNummer)
    {
        var result = await _service.GetByFiBuKontoAsync(vereinId, fiBuNummer);
        return Ok(result);
    }

    /// <summary>
    /// Get total open amount
    /// </summary>
    [HttpGet("verein/{vereinId}/total-open")]
    public async Task<ActionResult<decimal>> GetTotalOpenAmount(int vereinId)
    {
        var result = await _service.GetTotalOpenAmountAsync(vereinId);
        return Ok(result);
    }

    /// <summary>
    /// Get summary by recipient
    /// </summary>
    [HttpGet("verein/{vereinId}/empfaenger-summary")]
    public async Task<ActionResult<IEnumerable<DurchlaufendePostenSummaryDto>>> GetEmpfaengerSummary(int vereinId)
    {
        var result = await _service.GetEmpfaengerSummaryAsync(vereinId);
        return Ok(result);
    }

    /// <summary>
    /// Create a new transit item
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<DurchlaufendePostenDto>> Create([FromBody] CreateDurchlaufendePostenDto createDto)
    {
        var result = await _service.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update an existing transit item
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<DurchlaufendePostenDto>> Update(int id, [FromBody] UpdateDurchlaufendePostenDto updateDto)
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
            return NotFound($"Transit item with ID {id} not found");
        }
    }

    /// <summary>
    /// Close a transit item (mark as transferred)
    /// </summary>
    [HttpPost("{id}/close")]
    public async Task<ActionResult<DurchlaufendePostenDto>> Close(
        int id,
        [FromQuery] DateTime ausgabenDatum,
        [FromQuery] decimal ausgabenBetrag,
        [FromQuery] string? referenz = null)
    {
        try
        {
            var result = await _service.CloseAsync(id, ausgabenDatum, ausgabenBetrag, referenz);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Transit item with ID {id} not found");
        }
    }

    /// <summary>
    /// Delete a transit item (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound($"Transit item with ID {id} not found");
        return NoContent();
    }
}

