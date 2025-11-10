using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.BankBuchung;
using VereinsApi.DTOs.Finanz;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Bank Buchungen (Bank Transactions)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class BankBuchungenController : ControllerBase
{
    private readonly IBankBuchungService _service;
    private readonly IBankUploadService _uploadService;
    private readonly ILogger<BankBuchungenController> _logger;

    public BankBuchungenController(
        IBankBuchungService service,
        IBankUploadService uploadService,
        ILogger<BankBuchungenController> logger)
    {
        _service = service;
        _uploadService = uploadService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Bank Buchungen
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BankBuchungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankBuchungDto>>> GetAll(
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var buchungen = await _service.GetAllAsync(includeDeleted, cancellationToken);
            return Ok(buchungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all bank buchungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Bank Buchung by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(BankBuchungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankBuchungDto>> GetById(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var buchung = await _service.GetByIdAsync(id, cancellationToken);
            if (buchung == null)
            {
                return NotFound($"Bank buchung with ID {id} not found");
            }
            return Ok(buchung);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bank buchung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Bank Buchungen by Verein ID
    /// </summary>
    [HttpGet("verein/{vereinId:int}")]
    [ProducesResponseType(typeof(IEnumerable<BankBuchungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankBuchungDto>>> GetByVerein(
        int vereinId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var buchungen = await _service.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
            return Ok(buchungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bank buchungen for verein {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Bank Buchungen by BankKonto ID
    /// </summary>
    [HttpGet("bankkonto/{bankKontoId:int}")]
    [ProducesResponseType(typeof(IEnumerable<BankBuchungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankBuchungDto>>> GetByBankKonto(
        int bankKontoId,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var buchungen = await _service.GetByBankKontoIdAsync(bankKontoId, includeDeleted, cancellationToken);
            return Ok(buchungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bank buchungen for bankkonto {BankKontoId}", bankKontoId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get unmatched Bank Buchungen
    /// </summary>
    [HttpGet("unmatched")]
    [ProducesResponseType(typeof(IEnumerable<BankBuchungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankBuchungDto>>> GetUnmatched(
        [FromQuery] int? bankKontoId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var buchungen = await _service.GetUnmatchedAsync(bankKontoId, cancellationToken);
            return Ok(buchungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unmatched bank buchungen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Bank Buchungen by date range
    /// </summary>
    [HttpGet("date-range")]
    [ProducesResponseType(typeof(IEnumerable<BankBuchungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankBuchungDto>>> GetByDateRange(
        [FromQuery] DateTime fromDate,
        [FromQuery] DateTime toDate,
        [FromQuery] int? bankKontoId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var buchungen = await _service.GetByDateRangeAsync(fromDate, toDate, bankKontoId, cancellationToken);
            return Ok(buchungen);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bank buchungen by date range");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get total amount for a BankKonto
    /// </summary>
    [HttpGet("bankkonto/{bankKontoId:int}/total")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    public async Task<ActionResult<decimal>> GetTotalAmount(
        int bankKontoId,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var total = await _service.GetTotalAmountAsync(bankKontoId, fromDate, toDate, cancellationToken);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total amount for bankkonto {BankKontoId}", bankKontoId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create new Bank Buchung
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(BankBuchungDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BankBuchungDto>> Create(
        [FromBody] CreateBankBuchungDto createDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var created = await _service.CreateAsync(createDto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bank buchung");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update Bank Buchung
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(BankBuchungDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankBuchungDto>> Update(
        int id,
        [FromBody] UpdateBankBuchungDto updateDto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, updateDto, cancellationToken);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Bank buchung with ID {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating bank buchung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete Bank Buchung
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _service.DeleteAsync(id, cancellationToken);
            if (!result)
            {
                return NotFound($"Bank buchung with ID {id} not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bank buchung {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Upload bank transaction Excel file
    /// </summary>
    /// <remarks>
    /// Upload an Excel file containing bank transactions.
    /// The system will:
    /// 1. Parse the Excel file
    /// 2. Create BankBuchung records
    /// 3. Match transactions to members (by IBAN, name, or reference)
    /// 4. Create MitgliedZahlung records for matched members
    /// 5. Update MitgliedForderung status (mark as paid)
    /// 6. Create MitgliedForderungZahlung allocations
    ///
    /// Expected Excel columns (flexible order):
    /// - Buchungsdatum / Datum / Date / Valuta
    /// - Betrag / Amount / Wert
    /// - Empfänger / Auftraggeber / Name / Recipient
    /// - Verwendungszweck / Purpose / Beschreibung
    /// - Referenz / Reference / Ref
    /// - IBAN / Konto
    /// </remarks>
    [HttpPost("upload-excel")]
    [ProducesResponseType(typeof(BankUploadResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<BankUploadResponseDto>> UploadExcel(
        [FromForm] int vereinId,
        [FromForm] int bankKontoId,
        [FromForm] IFormFile file)
    {
        try
        {
            _logger.LogInformation("Received Excel upload request for Verein {VereinId}, BankKonto {BankKontoId}",
                vereinId, bankKontoId);

            var request = new BankUploadRequestDto
            {
                VereinId = vereinId,
                BankKontoId = bankKontoId,
                File = file
            };

            var response = await _uploadService.ProcessBankUploadAsync(request);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Excel upload");
            return StatusCode(500, new BankUploadResponseDto
            {
                Success = false,
                Message = "Internal server error",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}

