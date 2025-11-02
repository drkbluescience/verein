using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VereinsApi.DTOs.Keytable;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Controllers;

/// <summary>
/// API controller for Keytable (lookup) operations
/// Provides read-only access to all lookup tables with translations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KeytableController : ControllerBase
{
    private readonly IKeytableService _keytableService;
    private readonly ILogger<KeytableController> _logger;

    public KeytableController(
        IKeytableService keytableService,
        ILogger<KeytableController> logger)
    {
        _keytableService = keytableService;
        _logger = logger;
    }

    #region Gender (Geschlecht)

    /// <summary>
    /// Gets all genders with translations
    /// </summary>
    [HttpGet("geschlechter")]
    [ProducesResponseType(typeof(IEnumerable<GeschlechtDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<GeschlechtDto>>> GetGeschlechter(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all genders");
        var result = await _keytableService.GetAllGeschlechterAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Member Status (MitgliedStatus)

    /// <summary>
    /// Gets all member statuses with translations
    /// </summary>
    [HttpGet("mitgliedstatuse")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedStatusDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedStatusDto>>> GetMitgliedStatuse(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all member statuses");
        var result = await _keytableService.GetAllMitgliedStatuseAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Member Type (MitgliedTyp)

    /// <summary>
    /// Gets all member types with translations
    /// </summary>
    [HttpGet("mitgliedtypen")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedTypDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedTypDto>>> GetMitgliedTypen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all member types");
        var result = await _keytableService.GetAllMitgliedTypenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Family Relationship Type (FamilienbeziehungTyp)

    /// <summary>
    /// Gets all family relationship types with translations
    /// </summary>
    [HttpGet("familienbeziehungtypen")]
    [ProducesResponseType(typeof(IEnumerable<FamilienbeziehungTypDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FamilienbeziehungTypDto>>> GetFamilienbeziehungTypen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all family relationship types");
        var result = await _keytableService.GetAllFamilienbeziehungTypenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Payment Type (ZahlungTyp)

    /// <summary>
    /// Gets all payment types with translations
    /// </summary>
    [HttpGet("zahlungtypen")]
    [ProducesResponseType(typeof(IEnumerable<ZahlungTypDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ZahlungTypDto>>> GetZahlungTypen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all payment types");
        var result = await _keytableService.GetAllZahlungTypenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Payment Status (ZahlungStatus)

    /// <summary>
    /// Gets all payment statuses with translations
    /// </summary>
    [HttpGet("zahlungstatuse")]
    [ProducesResponseType(typeof(IEnumerable<ZahlungStatusDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ZahlungStatusDto>>> GetZahlungStatuse(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all payment statuses");
        var result = await _keytableService.GetAllZahlungStatuseAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Claim Type (Forderungsart)

    /// <summary>
    /// Gets all claim types with translations
    /// </summary>
    [HttpGet("forderungsarten")]
    [ProducesResponseType(typeof(IEnumerable<ForderungsartDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ForderungsartDto>>> GetForderungsarten(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all claim types");
        var result = await _keytableService.GetAllForderungsartenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Claim Status (Forderungsstatus)

    /// <summary>
    /// Gets all claim statuses with translations
    /// </summary>
    [HttpGet("forderungsstatuse")]
    [ProducesResponseType(typeof(IEnumerable<ForderungsstatusDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ForderungsstatusDto>>> GetForderungsstatuse(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all claim statuses");
        var result = await _keytableService.GetAllForderungsstatuseAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Currency (Waehrung)

    /// <summary>
    /// Gets all currencies with translations
    /// </summary>
    [HttpGet("waehrungen")]
    [ProducesResponseType(typeof(IEnumerable<WaehrungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<WaehrungDto>>> GetWaehrungen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all currencies");
        var result = await _keytableService.GetAllWaehrungenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Legal Form (Rechtsform)

    /// <summary>
    /// Gets all legal forms with translations
    /// </summary>
    [HttpGet("rechtsformen")]
    [ProducesResponseType(typeof(IEnumerable<RechtsformDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RechtsformDto>>> GetRechtsformen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all legal forms");
        var result = await _keytableService.GetAllRechtsformenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Address Type (AdresseTyp)

    /// <summary>
    /// Gets all address types with translations
    /// </summary>
    [HttpGet("adressetypen")]
    [ProducesResponseType(typeof(IEnumerable<AdresseTypDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AdresseTypDto>>> GetAdresseTypen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all address types");
        var result = await _keytableService.GetAllAdresseTypenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Account Type (Kontotyp)

    /// <summary>
    /// Gets all account types with translations
    /// </summary>
    [HttpGet("kontotypen")]
    [ProducesResponseType(typeof(IEnumerable<KontotypDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<KontotypDto>>> GetKontotypen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all account types");
        var result = await _keytableService.GetAllKontotypenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Family Member Status (MitgliedFamilieStatus)

    /// <summary>
    /// Gets all family member statuses with translations
    /// </summary>
    [HttpGet("mitgliedfamiliestatuse")]
    [ProducesResponseType(typeof(IEnumerable<MitgliedFamilieStatusDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MitgliedFamilieStatusDto>>> GetMitgliedFamilieStatuse(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all family member statuses");
        var result = await _keytableService.GetAllMitgliedFamilieStatuseAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Nationality (Staatsangehoerigkeit)

    /// <summary>
    /// Gets all nationalities with translations
    /// </summary>
    [HttpGet("staatsangehoerigkeiten")]
    [ProducesResponseType(typeof(IEnumerable<StaatsangehoerigkeitDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<StaatsangehoerigkeitDto>>> GetStaatsangehoerigkeiten(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all nationalities");
        var result = await _keytableService.GetAllStaatsangehoerigkeitenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Contribution Period (BeitragPeriode)

    /// <summary>
    /// Gets all contribution periods with translations
    /// </summary>
    [HttpGet("beitragperioden")]
    [ProducesResponseType(typeof(IEnumerable<BeitragPeriodeDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BeitragPeriodeDto>>> GetBeitragPerioden(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all contribution periods");
        var result = await _keytableService.GetAllBeitragPeriodenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Contribution Payment Day Type (BeitragZahlungstagTyp)

    /// <summary>
    /// Gets all contribution payment day types with translations
    /// </summary>
    [HttpGet("beitragzahlungstagtypen")]
    [ProducesResponseType(typeof(IEnumerable<BeitragZahlungstagTypDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BeitragZahlungstagTypDto>>> GetBeitragZahlungstagTypen(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all contribution payment day types");
        var result = await _keytableService.GetAllBeitragZahlungstagTypenAsync(cancellationToken);
        return Ok(result);
    }

    #endregion
}

