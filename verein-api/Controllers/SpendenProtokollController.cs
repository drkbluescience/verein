using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.SpendenProtokoll;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for SpendenProtokoll (Donation Protocol) operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SpendenProtokollController : ControllerBase
{
    private readonly ISpendenProtokollService _service;
    private readonly ILogger<SpendenProtokollController> _logger;

    public SpendenProtokollController(ISpendenProtokollService service, ILogger<SpendenProtokollController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all donation protocols
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SpendenProtokollDto>>> GetAll([FromQuery] bool includeDeleted = false)
    {
        var result = await _service.GetAllAsync(includeDeleted);
        return Ok(result);
    }

    /// <summary>
    /// Get donation protocol by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SpendenProtokollDto>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound($"Donation protocol with ID {id} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get donation protocols by Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    public async Task<ActionResult<IEnumerable<SpendenProtokollDto>>> GetByVerein(int vereinId)
    {
        var result = await _service.GetByVereinIdAsync(vereinId);
        return Ok(result);
    }

    /// <summary>
    /// Get donation protocols by date range
    /// </summary>
    [HttpGet("verein/{vereinId}/daterange")]
    public async Task<ActionResult<IEnumerable<SpendenProtokollDto>>> GetByDateRange(
        int vereinId,
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate)
    {
        var result = await _service.GetByDateRangeAsync(vereinId, fromDate, toDate);
        return Ok(result);
    }

    /// <summary>
    /// Get donation protocols by purpose category
    /// </summary>
    [HttpGet("verein/{vereinId}/kategorie/{kategorie}")]
    public async Task<ActionResult<IEnumerable<SpendenProtokollDto>>> GetByKategorie(int vereinId, string kategorie)
    {
        var result = await _service.GetByZweckKategorieAsync(vereinId, kategorie);
        return Ok(result);
    }

    /// <summary>
    /// Get total donation amount
    /// </summary>
    [HttpGet("verein/{vereinId}/total")]
    public async Task<ActionResult<decimal>> GetTotalAmount(
        int vereinId,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var result = await _service.GetTotalAmountAsync(vereinId, fromDate, toDate);
        return Ok(result);
    }

    /// <summary>
    /// Get donation summary by category
    /// </summary>
    [HttpGet("verein/{vereinId}/summary")]
    public async Task<ActionResult<IEnumerable<SpendenKategorieSummaryDto>>> GetKategorieSummary(
        int vereinId,
        [FromQuery] int? jahr = null)
    {
        var result = await _service.GetKategorieSummaryAsync(vereinId, jahr);
        return Ok(result);
    }

    /// <summary>
    /// Create a new donation protocol
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<SpendenProtokollDto>> Create([FromBody] CreateSpendenProtokollDto createDto)
    {
        var result = await _service.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update an existing donation protocol
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<SpendenProtokollDto>> Update(int id, [FromBody] UpdateSpendenProtokollDto updateDto)
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
            return NotFound($"Donation protocol with ID {id} not found");
        }
    }

    /// <summary>
    /// Sign the protocol (witness signature)
    /// </summary>
    [HttpPost("{id}/sign/{zeugeNumber}")]
    public async Task<ActionResult<SpendenProtokollDto>> Sign(int id, int zeugeNumber)
    {
        try
        {
            var result = await _service.SignAsync(id, zeugeNumber);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Donation protocol with ID {id} not found");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Link protocol to Kassenbuch entry
    /// </summary>
    [HttpPost("{id}/link-kassenbuch/{kassenbuchId}")]
    public async Task<ActionResult<SpendenProtokollDto>> LinkToKassenbuch(int id, int kassenbuchId)
    {
        try
        {
            var result = await _service.LinkToKassenbuchAsync(id, kassenbuchId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Donation protocol with ID {id} not found");
        }
    }

    /// <summary>
    /// Delete a donation protocol (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound($"Donation protocol with ID {id} not found");
        return NoContent();
    }
}

