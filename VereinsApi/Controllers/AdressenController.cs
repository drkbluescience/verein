using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Adresse;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// Controller for managing Adressen (Addresses)
/// </summary>
[ApiController] // API controller özelliklerini aktifleştirir
[Route("api/[controller]")] // base route
[Produces("application/json")] // JSON response döner
// ControllerBase - API controller base class
public class AdressenController : ControllerBase
{
    private readonly IRepository<Adresse> _adresseRepository;
    private readonly ILogger<AdressenController> _logger;

    public AdressenController(
        IRepository<Adresse> adresseRepository,
        ILogger<AdressenController> logger)
    {
        _adresseRepository = adresseRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all Adressen
    /// </summary>
    /// <returns>List of all Adressen</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AdresseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AdresseDto>>> GetAll()
    {
        try
        {
            var adressen = await _adresseRepository.GetAllAsync();
            var adresseDtos = adressen.Select(a => MapToDto(a));

            return Ok(adresseDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all Adressen");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get a specific Adresse by ID
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <returns>Adresse details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdresseDto>> GetById(int id)
    {
        try
        {
            var adresse = await _adresseRepository.GetByIdAsync(id);
            if (adresse == null)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            var adresseDto = MapToDto(adresse);
            return Ok(adresseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Adresse with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Get Adressen by Verein ID
    /// </summary>
    /// <param name="vereinId">Verein ID</param>
    /// <returns>List of Adressen for the specified Verein</returns>
    [HttpGet("verein/{vereinId}")]
    [ProducesResponseType(typeof(IEnumerable<AdresseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AdresseDto>>> GetByVereinId(int vereinId)
    {
        try
        {
            var adressen = await _adresseRepository.GetAsync(a => a.VereinId == vereinId);
            var adresseDtos = adressen.Select(a => MapToDto(a));

            return Ok(adresseDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting Adressen for Verein ID {VereinId}", vereinId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Create a new Adresse
    /// </summary>
    /// <param name="createDto">Adresse creation data</param>
    /// <returns>Created Adresse</returns>
    [HttpPost]
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AdresseDto>> Create([FromBody] CreateAdresseDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adresse = MapFromCreateDto(createDto);

            await _adresseRepository.AddAsync(adresse);
            await _adresseRepository.SaveChangesAsync();

            var adresseDto = MapToDto(adresse);
            return CreatedAtAction(nameof(GetById), new { id = adresse.Id }, adresseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating Adresse");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Update an existing Adresse
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <param name="updateDto">Adresse update data</param>
    /// <returns>Updated Adresse</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdresseDto>> Update(int id, [FromBody] UpdateAdresseDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var adresse = await _adresseRepository.GetByIdAsync(id);
            if (adresse == null)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            MapFromUpdateDto(updateDto, adresse);

            await _adresseRepository.UpdateAsync(adresse);
            await _adresseRepository.SaveChangesAsync();

            var adresseDto = MapToDto(adresse);
            return Ok(adresseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating Adresse with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Delete an Adresse (soft delete)
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var adresse = await _adresseRepository.GetByIdAsync(id);
            if (adresse == null)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            // Soft delete: Set DeletedFlag and audit fields
            adresse.DeletedFlag = true;
            adresse.Aktiv = false;
            adresse.Modified = DateTime.UtcNow;
            adresse.ModifiedBy = GetCurrentUserId();

            await _adresseRepository.UpdateAsync(adresse);
            await _adresseRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting Adresse with ID {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Set an Adresse as default for a Verein
    /// </summary>
    /// <param name="id">Adresse ID</param>
    /// <returns>Updated Adresse</returns>
    [HttpPatch("{id}/set-default")]
    [ProducesResponseType(typeof(AdresseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdresseDto>> SetAsDefault(int id)
    {
        try
        {
            var adresse = await _adresseRepository.GetByIdAsync(id);
            if (adresse == null)
            {
                return NotFound($"Adresse with ID {id} not found");
            }

            // First, unset all other addresses for this Verein as default
            if (adresse.VereinId.HasValue)
            {
                var otherAdressen = await _adresseRepository.GetAsync(a =>
                    a.VereinId == adresse.VereinId && a.Id != id && a.IstStandard == true);
                
                foreach (var otherAdresse in otherAdressen)
                {
                    otherAdresse.IstStandard = false;
                    otherAdresse.Modified = DateTime.UtcNow;
                    otherAdresse.ModifiedBy = GetCurrentUserId();
                    await _adresseRepository.UpdateAsync(otherAdresse);
                }
            }

            // Set this address as default
            adresse.IstStandard = true;
            adresse.Modified = DateTime.UtcNow;
            adresse.ModifiedBy = GetCurrentUserId();
            await _adresseRepository.UpdateAsync(adresse);
            await _adresseRepository.SaveChangesAsync();

            var adresseDto = MapToDto(adresse);
            return Ok(adresseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while setting Adresse with ID {Id} as default", id);
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

    private AdresseDto MapToDto(Adresse adresse)
    {
        return new AdresseDto
        {
            Id = adresse.Id,
            VereinId = adresse.VereinId,
            AdresseTypId = adresse.AdresseTypId,
            Strasse = adresse.Strasse,
            Hausnummer = adresse.Hausnummer,
            Adresszusatz = adresse.Adresszusatz,
            PLZ = adresse.PLZ,
            Ort = adresse.Ort,
            Stadtteil = adresse.Stadtteil,
            Bundesland = adresse.Bundesland,
            Land = adresse.Land,
            Postfach = adresse.Postfach,
            Telefonnummer = adresse.Telefonnummer,
            Faxnummer = adresse.Faxnummer,
            EMail = adresse.EMail,
            Kontaktperson = adresse.Kontaktperson,
            Hinweis = adresse.Hinweis,
            Latitude = adresse.Latitude,
            Longitude = adresse.Longitude,
            GueltigVon = adresse.GueltigVon,
            GueltigBis = adresse.GueltigBis,
            IstStandard = adresse.IstStandard,
            Aktiv = adresse.Aktiv,
            Created = adresse.Created,
            CreatedBy = adresse.CreatedBy,
            Modified = adresse.Modified,
            ModifiedBy = adresse.ModifiedBy,
            DeletedFlag = adresse.DeletedFlag
        };
    }

    private Adresse MapFromCreateDto(CreateAdresseDto createDto)
    {
        return new Adresse
        {
            VereinId = createDto.VereinId,
            AdresseTypId = createDto.AdresseTypId,
            Strasse = createDto.Strasse,
            Hausnummer = createDto.Hausnummer,
            Adresszusatz = createDto.Adresszusatz,
            PLZ = createDto.PLZ,
            Ort = createDto.Ort,
            Stadtteil = createDto.Stadtteil,
            Bundesland = createDto.Bundesland,
            Land = createDto.Land,
            Postfach = createDto.Postfach,
            Telefonnummer = createDto.Telefonnummer,
            Faxnummer = createDto.Faxnummer,
            EMail = createDto.EMail,
            Kontaktperson = createDto.Kontaktperson,
            Hinweis = createDto.Hinweis,
            Latitude = createDto.Latitude,
            Longitude = createDto.Longitude,
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

    private void MapFromUpdateDto(UpdateAdresseDto updateDto, Adresse adresse)
    {
        adresse.VereinId = updateDto.VereinId;
        adresse.AdresseTypId = updateDto.AdresseTypId;
        adresse.Strasse = updateDto.Strasse;
        adresse.Hausnummer = updateDto.Hausnummer;
        adresse.Adresszusatz = updateDto.Adresszusatz;
        adresse.PLZ = updateDto.PLZ;
        adresse.Ort = updateDto.Ort;
        adresse.Stadtteil = updateDto.Stadtteil;
        adresse.Bundesland = updateDto.Bundesland;
        adresse.Land = updateDto.Land;
        adresse.Postfach = updateDto.Postfach;
        adresse.Telefonnummer = updateDto.Telefonnummer;
        adresse.Faxnummer = updateDto.Faxnummer;
        adresse.EMail = updateDto.EMail;
        adresse.Kontaktperson = updateDto.Kontaktperson;
        adresse.Hinweis = updateDto.Hinweis;
        adresse.Latitude = updateDto.Latitude;
        adresse.Longitude = updateDto.Longitude;
        adresse.GueltigVon = updateDto.GueltigVon;
        adresse.GueltigBis = updateDto.GueltigBis;
        adresse.IstStandard = updateDto.IstStandard;
        adresse.Aktiv = updateDto.Aktiv;
        // Audit fields set automatically by system
        adresse.Modified = DateTime.UtcNow;
        adresse.ModifiedBy = GetCurrentUserId();
    }

    #endregion
}
