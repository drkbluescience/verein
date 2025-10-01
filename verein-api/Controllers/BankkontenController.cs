using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Bankkonto;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Bankkonten (Bank Accounts)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class BankkontenController : ControllerBase
{
    private readonly IBankkontoService _bankkontoService;
    private readonly ILogger<BankkontenController> _logger;

    public BankkontenController(
        IBankkontoService bankkontoService,
        ILogger<BankkontenController> logger)
    {
        _bankkontoService = bankkontoService;
        _logger = logger;
    }

    /// <summary>
    /// Get all Bankkonten
    /// </summary>
    /// <returns>List of all Bankkonten</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BankkontoDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankkontoDto>>> GetAll()
    {
        try
        {
            var bankkontoDtos = await _bankkontoService.GetAllAsync();
            return Ok(bankkontoDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all Bankkonten");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific Bankkonto by ID
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <returns>Bankkonto details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BankkontoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankkontoDto>> GetById(int id)
    {
        try
        {
            var bankkontoDto = await _bankkontoService.GetByIdAsync(id);
            if (bankkontoDto == null)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            return Ok(bankkontoDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Bankkonto with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Bankkonten by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <returns>List of Bankkonten for the specified Verein</returns>
    [HttpGet("verein/{vereinId}")]
    [ProducesResponseType(typeof(IEnumerable<BankkontoDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BankkontoDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var bankkontoDtos = await _bankkontoService.GetByVereinIdAsync(vereinId);
            return Ok(bankkontoDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Bankkonten for Verein ID {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Bankkonten by IBAN
    /// </summary>
    /// <param name="iban">IBAN to search for</param>
    /// <returns>Bankkonto with the specified IBAN</returns>
    [HttpGet("iban/{iban}")]
    [ProducesResponseType(typeof(BankkontoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankkontoDto>> GetByIban(string iban)
    {
        try
        {
            var bankkontoDto = await _bankkontoService.GetByIbanAsync(iban);
            if (bankkontoDto == null)
            {
                return NotFound($"Bankkonto with IBAN {iban} not found");
            }

            return Ok(bankkontoDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Bankkonto with IBAN {Iban}", iban);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new Bankkonto
    /// </summary>
    /// <param name="createDto">Bankkonto creation data</param>
    /// <returns>Created Bankkonto</returns>
    [HttpPost]
    [ProducesResponseType(typeof(BankkontoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BankkontoDto>> Create([FromBody] CreateBankkontoDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bankkontoDto = await _bankkontoService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = bankkontoDto.Id }, bankkontoDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating Bankkonto");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Bankkonto");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing Bankkonto
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <param name="updateDto">Bankkonto update data</param>
    /// <returns>Updated Bankkonto</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(BankkontoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankkontoDto>> Update(int id, [FromBody] UpdateBankkontoDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bankkontoDto = await _bankkontoService.UpdateAsync(id, updateDto);
            return Ok(bankkontoDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating Bankkonto with ID {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Bankkonto with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a Bankkonto (soft delete)
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var result = await _bankkontoService.DeleteAsync(id);
            if (!result)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Bankkonto with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Set a Bankkonto as default for a Verein
    /// </summary>
    /// <param name="id">Bankkonto ID</param>
    /// <returns>Updated Bankkonto</returns>
    [HttpPatch("{id}/set-default")]
    [ProducesResponseType(typeof(BankkontoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankkontoDto>> SetAsDefault(int id)
    {
        try
        {
            var bankkontoDto = await _bankkontoService.GetByIdAsync(id);
            if (bankkontoDto == null)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            var result = await _bankkontoService.SetAsStandardAccountAsync(bankkontoDto.VereinId, id);
            if (!result)
            {
                return BadRequest("Failed to set bankkonto as standard");
            }

            var updatedBankkontoDto = await _bankkontoService.GetByIdAsync(id);
            return Ok(updatedBankkontoDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while setting Bankkonto with ID {Id} as default", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Validate IBAN format (basic validation)
    /// </summary>
    /// <param name="iban">IBAN to validate</param>
    /// <returns>True if valid format, false otherwise</returns>
    [HttpPost("validate-iban")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public ActionResult<object> ValidateIban([FromBody] string iban)
    {
        try
        {
            var isValid = _bankkontoService.IsValidIban(iban);
            return Ok(new { iban, isValid, message = isValid ? "Valid IBAN format" : "Invalid IBAN format" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while validating IBAN {Iban}", iban);
            return StatusCode(500, "Internal server error");
        }
    }


}
