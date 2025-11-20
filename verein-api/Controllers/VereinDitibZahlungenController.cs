using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Finanz;
using VereinsApi.DTOs.VereinDitibZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Verein DITIB Zahlungen
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VereinDitibZahlungenController : ControllerBase
{
    private readonly IVereinDitibZahlungService _service;
    private readonly IDitibUploadService _uploadService;
    private readonly ILogger<VereinDitibZahlungenController> _logger;

    public VereinDitibZahlungenController(
        IVereinDitibZahlungService service,
        IDitibUploadService uploadService,
        ILogger<VereinDitibZahlungenController> logger)
    {
        _service = service;
        _uploadService = uploadService;
        _logger = logger;
    }

    /// <summary>
    /// Get all DITIB Zahlungen
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VereinDitibZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDitibZahlungDto>>> GetAll(
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetAllAsync(includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all DITIB zahlungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get DITIB Zahlung by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(VereinDitibZahlungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinDitibZahlungDto>> GetById(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlung = await _service.GetByIdAsync(id, cancellationToken);
            if (zahlung == null)
            {
                return NotFound($"DITIB Zahlung with ID {id} not found");
            }
            return Ok(zahlung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting DITIB zahlung with ID {ZahlungId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get DITIB Zahlungen by Verein ID
    /// </summary>
    [HttpGet("verein/{vereinId:int}")]
    [ProducesResponseType(typeof(IEnumerable<VereinDitibZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDitibZahlungDto>>> GetByVerein(
        int vereinId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting DITIB zahlungen for verein {VereinId}", vereinId);
            return StatusCode(500, new {
                error = "Internal server error",
                message = ex.Message,
                innerException = ex.InnerException?.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    /// <summary>
    /// Get DITIB Zahlungen by date range
    /// </summary>
    [HttpGet("date-range")]
    [ProducesResponseType(typeof(IEnumerable<VereinDitibZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDitibZahlungDto>>> GetByDateRange(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate,
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting DITIB zahlungen by date range");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get DITIB Zahlungen by payment period
    /// </summary>
    [HttpGet("periode/{zahlungsperiode}")]
    [ProducesResponseType(typeof(IEnumerable<VereinDitibZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDitibZahlungDto>>> GetByPeriode(
        string zahlungsperiode,
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByZahlungsperiodeAsync(zahlungsperiode, vereinId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting DITIB zahlungen for period {Zahlungsperiode}", zahlungsperiode);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get DITIB Zahlungen by status
    /// </summary>
    [HttpGet("status/{statusId:int}")]
    [ProducesResponseType(typeof(IEnumerable<VereinDitibZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDitibZahlungDto>>> GetByStatus(
        int statusId,
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetByStatusAsync(statusId, vereinId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting DITIB zahlungen by status {StatusId}", statusId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get pending DITIB Zahlungen
    /// </summary>
    [HttpGet("pending")]
    [ProducesResponseType(typeof(IEnumerable<VereinDitibZahlungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDitibZahlungDto>>> GetPending(
        [FromQuery] int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var zahlungen = await _service.GetPendingAsync(vereinId, cancellationToken);
            return Ok(zahlungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending DITIB zahlungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get total payment amount for a verein
    /// </summary>
    [HttpGet("total/{vereinId:int}")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    public async Task<ActionResult<decimal>> GetTotalAmount(
        int vereinId,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var total = await _service.GetTotalPaymentAmountAsync(vereinId, fromDate, toDate, cancellationToken);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total DITIB payment amount for verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new DITIB Zahlung
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(VereinDitibZahlungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VereinDitibZahlungDto>> Create(
        [FromBody] CreateVereinDitibZahlungDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var created = await _service.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating DITIB zahlung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing DITIB Zahlung
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(VereinDitibZahlungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinDitibZahlungDto>> Update(
        int id,
        [FromBody] UpdateVereinDitibZahlungDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"DITIB Zahlung with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating DITIB zahlung with ID {ZahlungId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a DITIB Zahlung (soft delete)
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _service.DeleteAsync(id, cancellationToken);
            if (!result)
            {
                return NotFound($"DITIB Zahlung with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting DITIB zahlung with ID {ZahlungId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Upload DITIB payment Excel file
    /// </summary>
    /// <remarks>
    /// Upload an Excel file containing DITIB payments.
    /// The system will:
    /// 1. Parse the Excel file
    /// 2. Create BankBuchung records (negative amounts for expenses)
    /// 3. Create VereinDitibZahlung records
    /// 4. Link payments to bank transactions
    ///
    /// Expected Excel columns (flexible order):
    /// - Buchungsdatum / Datum / Date / Valuta
    /// - Betrag / Amount / Wert
    /// - Referenz / Reference / Ref
    /// - Verwendungszweck / Purpose / Beschreibung (optional)
    /// </remarks>
    [HttpPost("upload-excel")]
    [ProducesResponseType(typeof(DitibUploadResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<DitibUploadResponseDto>> UploadExcel(
        [FromForm] int vereinId,
        [FromForm] int bankKontoId,
        [FromForm] IFormFile file)
    {
        try
        {
            _logger.LogInformation("Received DITIB Excel upload request for Verein {VereinId}, BankKonto {BankKontoId}",
                vereinId, bankKontoId);

            var request = new DitibUploadRequestDto
            {
                VereinId = vereinId,
                BankKontoId = bankKontoId,
                File = file
            };

            var response = await _uploadService.ProcessDitibUploadAsync(request);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing DITIB Excel upload");
            return StatusCode(500, new DitibUploadResponseDto
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}

