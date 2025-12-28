using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.FiBuKonto;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for FiBuKonto (Financial Account) operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FiBuKontenController : ControllerBase
{
    private readonly IFiBuKontoService _service;
    private readonly ILogger<FiBuKontenController> _logger;

    public FiBuKontenController(IFiBuKontoService service, ILogger<FiBuKontenController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all FiBuKonten
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FiBuKontoDto>>> GetAll([FromQuery] bool includeDeleted = false)
    {
        var result = await _service.GetAllAsync(includeDeleted);
        return Ok(result);
    }

    /// <summary>
    /// Get FiBuKonto by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<FiBuKontoDto>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound($"FiBuKonto with ID {id} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get FiBuKonto by account number
    /// </summary>
    [HttpGet("nummer/{nummer}")]
    public async Task<ActionResult<FiBuKontoDto>> GetByNummer(string nummer)
    {
        var result = await _service.GetByNummerAsync(nummer);
        if (result == null)
            return NotFound($"FiBuKonto with number {nummer} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get FiBuKonten by type (EINNAHMEN, AUSGABEN, EIN_AUSG)
    /// </summary>
    [HttpGet("typ/{typ}")]
    public async Task<ActionResult<IEnumerable<FiBuKontoDto>>> GetByTyp(string typ)
    {
        var result = await _service.GetByTypAsync(typ);
        return Ok(result);
    }

    /// <summary>
    /// Get income accounts (Einnahmen)
    /// </summary>
    [HttpGet("einnahmen")]
    public async Task<ActionResult<IEnumerable<FiBuKontoDto>>> GetEinnahmen()
    {
        var result = await _service.GetEinnahmenKontenAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get expense accounts (Ausgaben)
    /// </summary>
    [HttpGet("ausgaben")]
    public async Task<ActionResult<IEnumerable<FiBuKontoDto>>> GetAusgaben()
    {
        var result = await _service.GetAusgabenKontenAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get transit accounts (Durchlaufende Posten)
    /// </summary>
    [HttpGet("durchlaufend")]
    public async Task<ActionResult<IEnumerable<FiBuKontoDto>>> GetDurchlaufend()
    {
        var result = await _service.GetDurchlaufendePostenKontenAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get active FiBuKonten
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<FiBuKontoDto>>> GetActive()
    {
        var result = await _service.GetActiveAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get FiBuKonten grouped by type
    /// </summary>
    [HttpGet("grouped")]
    public async Task<ActionResult<Dictionary<string, IEnumerable<FiBuKontoDto>>>> GetGrouped()
    {
        var result = await _service.GetGroupedByTypAsync();
        return Ok(result);
    }

    /// <summary>
    /// Create a new FiBuKonto
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<FiBuKontoDto>> Create([FromBody] CreateFiBuKontoDto createDto)
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
    /// Update an existing FiBuKonto
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<FiBuKontoDto>> Update(int id, [FromBody] UpdateFiBuKontoDto updateDto)
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
            return NotFound($"FiBuKonto with ID {id} not found");
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    /// <summary>
    /// Delete a FiBuKonto (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound($"FiBuKonto with ID {id} not found");
        return NoContent();
    }

    /// <summary>
    /// Set active status of a FiBuKonto
    /// </summary>
    [HttpPatch("{id}/active")]
    public async Task<ActionResult> SetActiveStatus(int id, [FromBody] bool isActive)
    {
        var result = await _service.SetActiveStatusAsync(id, isActive);
        if (!result)
            return NotFound($"FiBuKonto with ID {id} not found");
        return NoContent();
    }
}

