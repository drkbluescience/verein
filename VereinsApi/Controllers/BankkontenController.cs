using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Bankkonto;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Bankkonten (Bank Accounts)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class BankkontenController : ControllerBase
{
    private readonly IRepository<Bankkonto> _bankkontoRepository;
    private readonly ILogger<BankkontenController> _logger;

    public BankkontenController(
        IRepository<Bankkonto> bankkontoRepository,
        ILogger<BankkontenController> logger)
    {
        _bankkontoRepository = bankkontoRepository;
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
            var bankkonten = await _bankkontoRepository.GetAllAsync();
            var bankkontoDtos = bankkonten.Select(b => MapToDto(b));

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
            var bankkonto = await _bankkontoRepository.GetByIdAsync(id);
            if (bankkonto == null)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            var bankkontoDto = MapToDto(bankkonto);
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
            var bankkonten = await _bankkontoRepository.GetAsync(b => b.VereinId == vereinId);
            var bankkontoDtos = bankkonten.Select(b => MapToDto(b));

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
            var bankkonto = await _bankkontoRepository.GetFirstOrDefaultAsync(b => b.IBAN == iban);
            if (bankkonto == null)
            {
                return NotFound($"Bankkonto with IBAN {iban} not found");
            }

            var bankkontoDto = MapToDto(bankkonto);
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

            // Validate IBAN format (basic validation)
            if (!IsValidIban(createDto.IBAN))
            {
                return BadRequest("Invalid IBAN format");
            }

            // Check if IBAN already exists
            var existingBankkonto = await _bankkontoRepository.GetFirstOrDefaultAsync(b => b.IBAN == createDto.IBAN);
            if (existingBankkonto != null)
            {
                return BadRequest($"Bankkonto with IBAN {createDto.IBAN} already exists");
            }

            var bankkonto = MapFromCreateDto(createDto);

            await _bankkontoRepository.AddAsync(bankkonto);
            await _bankkontoRepository.SaveChangesAsync();

            var bankkontoDto = MapToDto(bankkonto);
            return CreatedAtAction(nameof(GetById), new { id = bankkonto.Id }, bankkontoDto);
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

            var bankkonto = await _bankkontoRepository.GetByIdAsync(id);
            if (bankkonto == null)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            // Validate IBAN format if changed
            if (bankkonto.IBAN != updateDto.IBAN && !IsValidIban(updateDto.IBAN))
            {
                return BadRequest("Invalid IBAN format");
            }

            // Check if new IBAN already exists (if changed)
            if (bankkonto.IBAN != updateDto.IBAN)
            {
                var existingBankkonto = await _bankkontoRepository.GetFirstOrDefaultAsync(b => b.IBAN == updateDto.IBAN);
                if (existingBankkonto != null)
                {
                    return BadRequest($"Bankkonto with IBAN {updateDto.IBAN} already exists");
                }
            }

            MapFromUpdateDto(updateDto, bankkonto);

            await _bankkontoRepository.UpdateAsync(bankkonto);
            await _bankkontoRepository.SaveChangesAsync();

            var bankkontoDto = MapToDto(bankkonto);
            return Ok(bankkontoDto);
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
            var bankkonto = await _bankkontoRepository.GetByIdAsync(id);
            if (bankkonto == null)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            // Soft delete: Set DeletedFlag and audit fields
            bankkonto.DeletedFlag = true;
            bankkonto.Aktiv = false;
            bankkonto.Modified = DateTime.UtcNow;
            bankkonto.ModifiedBy = GetCurrentUserId();

            await _bankkontoRepository.UpdateAsync(bankkonto);
            await _bankkontoRepository.SaveChangesAsync();

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
            var bankkonto = await _bankkontoRepository.GetByIdAsync(id);
            if (bankkonto == null)
            {
                return NotFound($"Bankkonto with ID {id} not found");
            }

            // First, unset all other bank accounts for this Verein as default
            var otherBankkonten = await _bankkontoRepository.GetAsync(b => 
                b.VereinId == bankkonto.VereinId && b.Id != id && b.IstStandard == true);
            
            foreach (var otherBankkonto in otherBankkonten)
            {
                otherBankkonto.IstStandard = false;
                otherBankkonto.Modified = DateTime.UtcNow;
                otherBankkonto.ModifiedBy = GetCurrentUserId();
                await _bankkontoRepository.UpdateAsync(otherBankkonto);
            }

            // Set this bank account as default
            bankkonto.IstStandard = true;
            bankkonto.Modified = DateTime.UtcNow;
            bankkonto.ModifiedBy = GetCurrentUserId();
            await _bankkontoRepository.UpdateAsync(bankkonto);
            await _bankkontoRepository.SaveChangesAsync();

            var bankkontoDto = MapToDto(bankkonto);
            return Ok(bankkontoDto);
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
            var isValid = IsValidIban(iban);
            return Ok(new { iban, isValid, message = isValid ? "Valid IBAN format" : "Invalid IBAN format" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while validating IBAN {Iban}", iban);
            return StatusCode(500, "Internal server error");
        }
    }

    #region Private Helper Methods

    /// <summary>
    /// Get current user ID from authentication context
    /// For now returns a default value, should be implemented with proper authentication
    /// </summary>
    /// <returns>Current user ID</returns>
    private int? GetCurrentUserId()
    {
        // TODO: Implement proper authentication and get user ID from JWT token or session
        // For now, return null or a default value
        // Example implementation:
        // var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        // return userIdClaim != null ? int.Parse(userIdClaim.Value) : null;

        return null; // Will be null until authentication is implemented
    }

    #endregion

    #region Private Methods

    private BankkontoDto MapToDto(Bankkonto bankkonto)
    {
        return new BankkontoDto
        {
            Id = bankkonto.Id,
            VereinId = bankkonto.VereinId,
            KontotypId = bankkonto.KontotypId,
            IBAN = bankkonto.IBAN,
            BIC = bankkonto.BIC,
            Kontoinhaber = bankkonto.Kontoinhaber,
            Bankname = bankkonto.Bankname,
            KontoNr = bankkonto.KontoNr,
            BLZ = bankkonto.BLZ,
            Beschreibung = bankkonto.Beschreibung,
            GueltigVon = bankkonto.GueltigVon,
            GueltigBis = bankkonto.GueltigBis,
            IstStandard = bankkonto.IstStandard,
            Aktiv = bankkonto.Aktiv,
            Created = bankkonto.Created,
            CreatedBy = bankkonto.CreatedBy,
            Modified = bankkonto.Modified,
            ModifiedBy = bankkonto.ModifiedBy,
            DeletedFlag = bankkonto.DeletedFlag
        };
    }

    private Bankkonto MapFromCreateDto(CreateBankkontoDto createDto)
    {
        return new Bankkonto
        {
            VereinId = createDto.VereinId,
            KontotypId = createDto.KontotypId,
            IBAN = createDto.IBAN,
            BIC = createDto.BIC,
            Kontoinhaber = createDto.Kontoinhaber,
            Bankname = createDto.Bankname,
            KontoNr = createDto.KontoNr,
            BLZ = createDto.BLZ,
            Beschreibung = createDto.Beschreibung,
            GueltigVon = createDto.GueltigVon,
            GueltigBis = createDto.GueltigBis,
            IstStandard = createDto.IstStandard,
            // Audit fields set automatically by system
            Created = DateTime.UtcNow,
            CreatedBy = GetCurrentUserId(),
            DeletedFlag = false,
            Aktiv = true
        };
    }

    private void MapFromUpdateDto(UpdateBankkontoDto updateDto, Bankkonto bankkonto)
    {
        bankkonto.VereinId = updateDto.VereinId;
        bankkonto.KontotypId = updateDto.KontotypId;
        bankkonto.IBAN = updateDto.IBAN;
        bankkonto.BIC = updateDto.BIC;
        bankkonto.Kontoinhaber = updateDto.Kontoinhaber;
        bankkonto.Bankname = updateDto.Bankname;
        bankkonto.KontoNr = updateDto.KontoNr;
        bankkonto.BLZ = updateDto.BLZ;
        bankkonto.Beschreibung = updateDto.Beschreibung;
        bankkonto.GueltigVon = updateDto.GueltigVon;
        bankkonto.GueltigBis = updateDto.GueltigBis;
        bankkonto.IstStandard = updateDto.IstStandard;
        bankkonto.Aktiv = updateDto.Aktiv;
        // Audit fields set automatically by system
        bankkonto.Modified = DateTime.UtcNow;
        bankkonto.ModifiedBy = GetCurrentUserId();
    }

    private static bool IsValidIban(string iban)
    {
        if (string.IsNullOrWhiteSpace(iban))
            return false;

        // Remove spaces and convert to uppercase
        iban = iban.Replace(" ", "").ToUpperInvariant();

        // Basic length check (IBAN should be between 15-34 characters)
        if (iban.Length < 15 || iban.Length > 34)
            return false;

        // Check if it starts with 2 letters (country code)
        if (!char.IsLetter(iban[0]) || !char.IsLetter(iban[1]))
            return false;

        // Check if positions 2-3 are digits (check digits)
        if (!char.IsDigit(iban[2]) || !char.IsDigit(iban[3]))
            return false;

        // Basic format validation passed
        return true;
    }

    #endregion
}
