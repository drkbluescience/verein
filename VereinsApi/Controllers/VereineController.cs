using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Verein;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Vereine (Associations)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VereineController : ControllerBase
{
    private readonly IRepository<Verein> _vereinRepository;
    private readonly ILogger<VereineController> _logger;

    public VereineController(
        IRepository<Verein> vereinRepository,
        ILogger<VereineController> logger)
    {
        _vereinRepository = vereinRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all Vereine
    /// </summary>
    /// <returns>List of all Vereine</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VereinDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<VereinDto>>> GetAll()
    {
        try
        {
            var vereine = await _vereinRepository.GetAllAsync();
            var vereinDtos = vereine.Select(v => MapToDto(v));

            return Ok(vereinDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all Vereine");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific Verein by ID
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <returns>Verein details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinDto>> GetById(int id)
    {
        try
        {
            var verein = await _vereinRepository.GetByIdAsync(id);
            if (verein == null)
            {
                return NotFound($"Verein with ID {id} not found");
            }

            var vereinDto = MapToDto(verein);

            return Ok(vereinDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Verein with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new Verein
    /// </summary>
    /// <param name="createDto">Verein creation data</param>
    /// <returns>Created Verein</returns>
    [HttpPost]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VereinDto>> Create([FromBody] CreateVereinDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var verein = MapFromCreateDto(createDto);

            await _vereinRepository.AddAsync(verein);
            await _vereinRepository.SaveChangesAsync();

            var vereinDto = MapToDto(verein);

            return CreatedAtAction(nameof(GetById), new { id = verein.Id }, vereinDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Verein");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing Verein
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <param name="updateDto">Verein update data</param>
    /// <returns>Updated Verein</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(VereinDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<VereinDto>> Update(int id, [FromBody] UpdateVereinDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var verein = await _vereinRepository.GetByIdAsync(id);
            if (verein == null)
            {
                return NotFound($"Verein with ID {id} not found");
            }

            // Update properties using mapping method
            MapFromUpdateDto(updateDto, verein);

            await _vereinRepository.UpdateAsync(verein);
            await _vereinRepository.SaveChangesAsync();

            var vereinDto = MapToDto(verein);

            return Ok(vereinDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Verein with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete a Verein (soft delete)
    /// </summary>
    /// <param name="id">Verein ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var verein = await _vereinRepository.GetByIdAsync(id);
            if (verein == null)
            {
                return NotFound($"Verein with ID {id} not found");
            }

            // Soft delete: Set DeletedFlag and audit fields
            verein.DeletedFlag = true;
            verein.Aktiv = false;
            verein.Modified = DateTime.UtcNow;
            verein.ModifiedBy = GetCurrentUserId();

            await _vereinRepository.UpdateAsync(verein);
            await _vereinRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Verein with ID {Id}", id);
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

    #region Private Mapping Methods

    /// <summary>
    /// Map Verein entity to DTO
    /// </summary>
    /// <param name="verein">Verein entity</param>
    /// <returns>VereinDto</returns>
    private VereinDto MapToDto(Domain.Entities.Verein verein)
    {
        return new VereinDto
        {
            Id = verein.Id,
            Name = verein.Name,
            Kurzname = verein.Kurzname,
            Vereinsnummer = verein.Vereinsnummer,
            Steuernummer = verein.Steuernummer,
            RechtsformId = verein.RechtsformId,
            Gruendungsdatum = verein.Gruendungsdatum,
            Zweck = verein.Zweck,
            AdresseId = verein.AdresseId,
            HauptBankkontoId = verein.HauptBankkontoId,
            Telefon = verein.Telefon,
            Fax = verein.Fax,
            Email = verein.Email,
            Webseite = verein.Webseite,
            SocialMediaLinks = verein.SocialMediaLinks,
            Vorstandsvorsitzender = verein.Vorstandsvorsitzender,
            Geschaeftsfuehrer = verein.Geschaeftsfuehrer,
            VertreterEmail = verein.VertreterEmail,
            Kontaktperson = verein.Kontaktperson,
            Mitgliederzahl = verein.Mitgliederzahl,
            SatzungPfad = verein.SatzungPfad,
            LogoPfad = verein.LogoPfad,
            ExterneReferenzId = verein.ExterneReferenzId,
            Mandantencode = verein.Mandantencode,
            EPostEmpfangAdresse = verein.EPostEmpfangAdresse,
            SEPA_GlaeubigerID = verein.SEPA_GlaeubigerID,
            UstIdNr = verein.UstIdNr,
            ElektronischeSignaturKey = verein.ElektronischeSignaturKey,
            Aktiv = verein.Aktiv,
            Created = verein.Created,
            CreatedBy = verein.CreatedBy,
            Modified = verein.Modified,
            ModifiedBy = verein.ModifiedBy,
            DeletedFlag = verein.DeletedFlag
        };
    }

    /// <summary>
    /// Map CreateVereinDto to Verein entity
    /// </summary>
    /// <param name="createDto">CreateVereinDto</param>
    /// <returns>Verein entity</returns>
    private Domain.Entities.Verein MapFromCreateDto(CreateVereinDto createDto)
    {
        return new Domain.Entities.Verein
        {
            Name = createDto.Name,
            Kurzname = createDto.Kurzname,
            Vereinsnummer = createDto.Vereinsnummer,
            Steuernummer = createDto.Steuernummer,
            RechtsformId = createDto.RechtsformId,
            Gruendungsdatum = createDto.Gruendungsdatum,
            Zweck = createDto.Zweck,
            AdresseId = createDto.AdresseId,
            HauptBankkontoId = createDto.HauptBankkontoId,
            Telefon = createDto.Telefon,
            Fax = createDto.Fax,
            Email = createDto.Email,
            Webseite = createDto.Webseite,
            SocialMediaLinks = createDto.SocialMediaLinks,
            Vorstandsvorsitzender = createDto.Vorstandsvorsitzender,
            Geschaeftsfuehrer = createDto.Geschaeftsfuehrer,
            VertreterEmail = createDto.VertreterEmail,
            Kontaktperson = createDto.Kontaktperson,
            Mitgliederzahl = createDto.Mitgliederzahl,
            SatzungPfad = createDto.SatzungPfad,
            LogoPfad = createDto.LogoPfad,
            ExterneReferenzId = createDto.ExterneReferenzId,
            Mandantencode = createDto.Mandantencode,
            EPostEmpfangAdresse = createDto.EPostEmpfangAdresse,
            SEPA_GlaeubigerID = createDto.SEPA_GlaeubigerID,
            UstIdNr = createDto.UstIdNr,
            ElektronischeSignaturKey = createDto.ElektronischeSignaturKey,
            // Audit fields set automatically by system
            Created = DateTime.UtcNow,
            CreatedBy = GetCurrentUserId(),
            DeletedFlag = false,
            Aktiv = true
        };
    }

    /// <summary>
    /// Map CreateVereinDto to existing Verein entity (for updates)
    /// </summary>
    /// <param name="updateDto">CreateVereinDto</param>
    /// <param name="verein">Existing Verein entity</param>
    private void MapFromCreateDto(CreateVereinDto updateDto, Domain.Entities.Verein verein)
    {
        verein.Name = updateDto.Name;
        verein.Kurzname = updateDto.Kurzname;
        verein.Vereinsnummer = updateDto.Vereinsnummer;
        verein.Steuernummer = updateDto.Steuernummer;
        verein.RechtsformId = updateDto.RechtsformId;
        verein.Gruendungsdatum = updateDto.Gruendungsdatum;
        verein.Zweck = updateDto.Zweck;
        verein.AdresseId = updateDto.AdresseId;
        verein.HauptBankkontoId = updateDto.HauptBankkontoId;
        verein.Telefon = updateDto.Telefon;
        verein.Fax = updateDto.Fax;
        verein.Email = updateDto.Email;
        verein.Webseite = updateDto.Webseite;
        verein.SocialMediaLinks = updateDto.SocialMediaLinks;
        verein.Vorstandsvorsitzender = updateDto.Vorstandsvorsitzender;
        verein.Geschaeftsfuehrer = updateDto.Geschaeftsfuehrer;
        verein.VertreterEmail = updateDto.VertreterEmail;
        verein.Kontaktperson = updateDto.Kontaktperson;
        verein.Mitgliederzahl = updateDto.Mitgliederzahl;
        verein.SatzungPfad = updateDto.SatzungPfad;
        verein.LogoPfad = updateDto.LogoPfad;
        verein.ExterneReferenzId = updateDto.ExterneReferenzId;
        verein.Mandantencode = updateDto.Mandantencode;
        verein.EPostEmpfangAdresse = updateDto.EPostEmpfangAdresse;
        verein.SEPA_GlaeubigerID = updateDto.SEPA_GlaeubigerID;
        verein.UstIdNr = updateDto.UstIdNr;
        verein.ElektronischeSignaturKey = updateDto.ElektronischeSignaturKey;
        // Audit fields set automatically by system
        verein.Modified = DateTime.UtcNow;
        verein.ModifiedBy = GetCurrentUserId();
    }

    /// <summary>
    /// Map UpdateVereinDto to existing Verein entity (for updates)
    /// </summary>
    /// <param name="updateDto">UpdateVereinDto</param>
    /// <param name="verein">Existing Verein entity</param>
    private void MapFromUpdateDto(UpdateVereinDto updateDto, Domain.Entities.Verein verein)
    {
        verein.Name = updateDto.Name;
        verein.Kurzname = updateDto.Kurzname;
        verein.Vereinsnummer = updateDto.Vereinsnummer;
        verein.Steuernummer = updateDto.Steuernummer;
        verein.RechtsformId = updateDto.RechtsformId;
        verein.Gruendungsdatum = updateDto.Gruendungsdatum;
        verein.Zweck = updateDto.Zweck;
        verein.AdresseId = updateDto.AdresseId;
        verein.HauptBankkontoId = updateDto.HauptBankkontoId;
        verein.Telefon = updateDto.Telefon;
        verein.Fax = updateDto.Fax;
        verein.Email = updateDto.Email;
        verein.Webseite = updateDto.Webseite;
        verein.SocialMediaLinks = updateDto.SocialMediaLinks;
        verein.Vorstandsvorsitzender = updateDto.Vorstandsvorsitzender;
        verein.Geschaeftsfuehrer = updateDto.Geschaeftsfuehrer;
        verein.VertreterEmail = updateDto.VertreterEmail;
        verein.Kontaktperson = updateDto.Kontaktperson;
        verein.Mitgliederzahl = updateDto.Mitgliederzahl;
        verein.SatzungPfad = updateDto.SatzungPfad;
        verein.LogoPfad = updateDto.LogoPfad;
        verein.ExterneReferenzId = updateDto.ExterneReferenzId;
        verein.Mandantencode = updateDto.Mandantencode;
        verein.EPostEmpfangAdresse = updateDto.EPostEmpfangAdresse;
        verein.SEPA_GlaeubigerID = updateDto.SEPA_GlaeubigerID;
        verein.UstIdNr = updateDto.UstIdNr;
        verein.ElektronischeSignaturKey = updateDto.ElektronischeSignaturKey;
        verein.Aktiv = updateDto.Aktiv;
        // Audit fields set automatically by system
        verein.Modified = DateTime.UtcNow;
        verein.ModifiedBy = GetCurrentUserId();
    }

    #endregion
}
