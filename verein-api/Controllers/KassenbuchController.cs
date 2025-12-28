using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Kassenbuch;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for Kassenbuch (Cash Book) operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KassenbuchController : ControllerBase
{
    private readonly IKassenbuchService _service;
    private readonly ILogger<KassenbuchController> _logger;

    public KassenbuchController(IKassenbuchService service, ILogger<KassenbuchController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all Kassenbuch entries
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<KassenbuchDto>>> GetAll([FromQuery] bool includeDeleted = false)
    {
        var result = await _service.GetAllAsync(includeDeleted);
        return Ok(result);
    }

    /// <summary>
    /// Get Kassenbuch entry by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<KassenbuchDto>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound($"Kassenbuch entry with ID {id} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get Kassenbuch entries by Verein
    /// </summary>
    [HttpGet("verein/{vereinId}")]
    public async Task<ActionResult<IEnumerable<KassenbuchDto>>> GetByVerein(int vereinId, [FromQuery] bool includeDeleted = false)
    {
        var result = await _service.GetByVereinIdAsync(vereinId, includeDeleted);
        return Ok(result);
    }

    /// <summary>
    /// Get Kassenbuch entries by Verein and year
    /// </summary>
    [HttpGet("verein/{vereinId}/jahr/{jahr}")]
    public async Task<ActionResult<IEnumerable<KassenbuchDto>>> GetByVereinAndJahr(int vereinId, int jahr)
    {
        var result = await _service.GetByJahrAsync(vereinId, jahr);
        return Ok(result);
    }

    /// <summary>
    /// Get Kassenbuch entries by date range
    /// </summary>
    [HttpGet("verein/{vereinId}/daterange")]
    public async Task<ActionResult<IEnumerable<KassenbuchDto>>> GetByDateRange(
        int vereinId,
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate)
    {
        var result = await _service.GetByDateRangeAsync(vereinId, fromDate, toDate);
        return Ok(result);
    }

    /// <summary>
    /// Get Kassenbuch entry by BelegNr
    /// </summary>
    [HttpGet("verein/{vereinId}/jahr/{jahr}/beleg/{belegNr}")]
    public async Task<ActionResult<KassenbuchDto>> GetByBelegNr(int vereinId, int jahr, int belegNr)
    {
        var result = await _service.GetByBelegNrAsync(vereinId, jahr, belegNr);
        if (result == null)
            return NotFound($"Kassenbuch entry with BelegNr {belegNr} not found");
        return Ok(result);
    }

    /// <summary>
    /// Get Kassenbuch entries by FiBuKonto
    /// </summary>
    [HttpGet("verein/{vereinId}/konto/{fiBuNummer}")]
    public async Task<ActionResult<IEnumerable<KassenbuchDto>>> GetByFiBuKonto(
        int vereinId,
        string fiBuNummer,
        [FromQuery] int? jahr = null)
    {
        var result = await _service.GetByFiBuKontoAsync(vereinId, fiBuNummer, jahr);
        return Ok(result);
    }

    /// <summary>
    /// Get next available BelegNr
    /// </summary>
    [HttpGet("verein/{vereinId}/jahr/{jahr}/next-belegnr")]
    public async Task<ActionResult<int>> GetNextBelegNr(int vereinId, int jahr)
    {
        var result = await _service.GetNextBelegNrAsync(vereinId, jahr);
        return Ok(result);
    }

    /// <summary>
    /// Get financial summary for a year
    /// </summary>
    [HttpGet("verein/{vereinId}/jahr/{jahr}/summary")]
    public async Task<ActionResult<object>> GetSummary(int vereinId, int jahr)
    {
        var totalEinnahmen = await _service.GetTotalEinnahmenAsync(vereinId, jahr);
        var totalAusgaben = await _service.GetTotalAusgabenAsync(vereinId, jahr);
        var kasseSaldo = await _service.GetKasseSaldoAsync(vereinId, jahr);
        var bankSaldo = await _service.GetBankSaldoAsync(vereinId, jahr);

        return Ok(new
        {
            Jahr = jahr,
            TotalEinnahmen = totalEinnahmen,
            TotalAusgaben = totalAusgaben,
            Saldo = totalEinnahmen - totalAusgaben,
            KasseSaldo = kasseSaldo,
            BankSaldo = bankSaldo
        });
    }

    /// <summary>
    /// Get account summary for a year
    /// </summary>
    [HttpGet("verein/{vereinId}/jahr/{jahr}/konto-summary")]
    public async Task<ActionResult<IEnumerable<KassenbuchKontoSummaryDto>>> GetKontoSummary(int vereinId, int jahr)
    {
        var result = await _service.GetKontoSummaryAsync(vereinId, jahr);
        return Ok(result);
    }

    /// <summary>
    /// Create a new Kassenbuch entry
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<KassenbuchDto>> Create([FromBody] CreateKassenbuchDto createDto)
    {
        var result = await _service.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update an existing Kassenbuch entry
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<KassenbuchDto>> Update(int id, [FromBody] UpdateKassenbuchDto updateDto)
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
            return NotFound($"Kassenbuch entry with ID {id} not found");
        }
    }

    /// <summary>
    /// Delete a Kassenbuch entry (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound($"Kassenbuch entry with ID {id} not found");
        return NoContent();
    }
}

