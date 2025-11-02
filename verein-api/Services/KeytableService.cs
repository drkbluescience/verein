using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.DTOs.Keytable;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Keytable (lookup) operations
/// Provides read-only access to all lookup tables with memory caching
/// </summary>
public class KeytableService : IKeytableService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IMemoryCache _cache;
    private readonly ILogger<KeytableService> _logger;
    private const int CacheDurationMinutes = 1440; // 24 hours

    public KeytableService(
        ApplicationDbContext context,
        IMapper mapper,
        IMemoryCache cache,
        ILogger<KeytableService> logger)
    {
        _context = context;
        _mapper = mapper;
        _cache = cache;
        _logger = logger;
    }

    #region Gender (Geschlecht)

    public async Task<IEnumerable<GeschlechtDto>> GetAllGeschlechterAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_geschlechter";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<GeschlechtDto>? cached))
        {
            _logger.LogDebug("Returning Geschlechter from cache");
            return cached ?? new List<GeschlechtDto>();
        }

        var data = await _context.Geschlechter
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<GeschlechtDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Member Status (MitgliedStatus)

    public async Task<IEnumerable<MitgliedStatusDto>> GetAllMitgliedStatuseAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_mitgliedstatuse";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<MitgliedStatusDto>? cached))
        {
            return cached ?? new List<MitgliedStatusDto>();
        }

        var data = await _context.MitgliedStatuse
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<MitgliedStatusDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Member Type (MitgliedTyp)

    public async Task<IEnumerable<MitgliedTypDto>> GetAllMitgliedTypenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_mitgliedtypen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<MitgliedTypDto>? cached))
        {
            return cached ?? new List<MitgliedTypDto>();
        }

        var data = await _context.MitgliedTypen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<MitgliedTypDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Family Relationship Type (FamilienbeziehungTyp)

    public async Task<IEnumerable<FamilienbeziehungTypDto>> GetAllFamilienbeziehungTypenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_familienbeziehungtypen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<FamilienbeziehungTypDto>? cached))
        {
            return cached ?? new List<FamilienbeziehungTypDto>();
        }

        var data = await _context.FamilienbeziehungTypen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<FamilienbeziehungTypDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Payment Type (ZahlungTyp)

    public async Task<IEnumerable<ZahlungTypDto>> GetAllZahlungTypenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_zahlungtypen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<ZahlungTypDto>? cached))
        {
            return cached ?? new List<ZahlungTypDto>();
        }

        var data = await _context.ZahlungTypen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<ZahlungTypDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Payment Status (ZahlungStatus)

    public async Task<IEnumerable<ZahlungStatusDto>> GetAllZahlungStatuseAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_zahlungstatuse";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<ZahlungStatusDto>? cached))
        {
            return cached ?? new List<ZahlungStatusDto>();
        }

        var data = await _context.ZahlungStatuse
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<ZahlungStatusDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Claim Type (Forderungsart)

    public async Task<IEnumerable<ForderungsartDto>> GetAllForderungsartenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_forderungsarten";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<ForderungsartDto>? cached))
        {
            return cached ?? new List<ForderungsartDto>();
        }

        var data = await _context.Forderungsarten
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<ForderungsartDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Claim Status (Forderungsstatus)

    public async Task<IEnumerable<ForderungsstatusDto>> GetAllForderungsstatuseAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_forderungsstatuse";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<ForderungsstatusDto>? cached))
        {
            return cached ?? new List<ForderungsstatusDto>();
        }

        var data = await _context.Forderungsstatuse
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<ForderungsstatusDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Currency (Waehrung)

    public async Task<IEnumerable<WaehrungDto>> GetAllWaehrungenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_waehrungen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<WaehrungDto>? cached))
        {
            return cached ?? new List<WaehrungDto>();
        }

        var data = await _context.Waehrungen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<WaehrungDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Legal Form (Rechtsform)

    public async Task<IEnumerable<RechtsformDto>> GetAllRechtsformenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_rechtsformen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<RechtsformDto>? cached))
        {
            return cached ?? new List<RechtsformDto>();
        }

        var data = await _context.Rechtsformen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<RechtsformDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Address Type (AdresseTyp)

    public async Task<IEnumerable<AdresseTypDto>> GetAllAdresseTypenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_adressetypen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<AdresseTypDto>? cached))
        {
            return cached ?? new List<AdresseTypDto>();
        }

        var data = await _context.AdresseTypen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<AdresseTypDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Account Type (Kontotyp)

    public async Task<IEnumerable<KontotypDto>> GetAllKontotypenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_kontotypen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<KontotypDto>? cached))
        {
            return cached ?? new List<KontotypDto>();
        }

        var data = await _context.Kontotypen
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<KontotypDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Family Member Status (MitgliedFamilieStatus)

    public async Task<IEnumerable<MitgliedFamilieStatusDto>> GetAllMitgliedFamilieStatuseAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_mitgliedfamiliestatuse";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<MitgliedFamilieStatusDto>? cached))
        {
            return cached ?? new List<MitgliedFamilieStatusDto>();
        }

        var data = await _context.MitgliedFamilieStatuse
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<MitgliedFamilieStatusDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Nationality (Staatsangehoerigkeit)

    public async Task<IEnumerable<StaatsangehoerigkeitDto>> GetAllStaatsangehoerigkeitenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_staatsangehoerigkeiten";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<StaatsangehoerigkeitDto>? cached))
        {
            return cached ?? new List<StaatsangehoerigkeitDto>();
        }

        var data = await _context.Staatsangehoerigkeiten
            .Include(x => x.Uebersetzungen)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<StaatsangehoerigkeitDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Contribution Period (BeitragPeriode)

    public async Task<IEnumerable<BeitragPeriodeDto>> GetAllBeitragPeriodenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_beitragperioden";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<BeitragPeriodeDto>? cached))
        {
            return cached ?? new List<BeitragPeriodeDto>();
        }

        var data = await _context.BeitragPerioden
            .Include(x => x.Uebersetzungen)
            .OrderBy(x => x.Sort)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<BeitragPeriodeDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion

    #region Contribution Payment Day Type (BeitragZahlungstagTyp)

    public async Task<IEnumerable<BeitragZahlungstagTypDto>> GetAllBeitragZahlungstagTypenAsync(CancellationToken cancellationToken = default)
    {
        const string cacheKey = "keytable_beitragzahlungstagtypen";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<BeitragZahlungstagTypDto>? cached))
        {
            return cached ?? new List<BeitragZahlungstagTypDto>();
        }

        var data = await _context.BeitragZahlungstagTypen
            .Include(x => x.Uebersetzungen)
            .OrderBy(x => x.Sort)
            .ToListAsync(cancellationToken);

        var result = _mapper.Map<IEnumerable<BeitragZahlungstagTypDto>>(data);
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(CacheDurationMinutes));
        
        return result;
    }

    #endregion
}

