using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.KassenbuchJahresabschluss;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for KassenbuchJahresabschluss business operations
/// </summary>
public class KassenbuchJahresabschlussService : IKassenbuchJahresabschlussService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<KassenbuchJahresabschlussService> _logger;
    private readonly IKassenbuchService _kassenbuchService;

    public KassenbuchJahresabschlussService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<KassenbuchJahresabschlussService> logger,
        IKassenbuchService kassenbuchService)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _kassenbuchService = kassenbuchService;
    }

    #region CRUD Operations

    public async Task<KassenbuchJahresabschlussDto> CreateAsync(CreateKassenbuchJahresabschlussDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating year-end closing for Verein {VereinId}, Jahr {Jahr}", createDto.VereinId, createDto.Jahr);

        if (await ExistsForYearAsync(createDto.VereinId, createDto.Jahr, cancellationToken))
        {
            throw new InvalidOperationException($"Year-end closing already exists for Verein {createDto.VereinId} and year {createDto.Jahr}");
        }

        var entity = _mapper.Map<KassenbuchJahresabschluss>(createDto);
        _context.KassenbuchJahresabschluesse.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created year-end closing with ID {Id}", entity.Id);
        return _mapper.Map<KassenbuchJahresabschlussDto>(entity);
    }

    public async Task<KassenbuchJahresabschlussDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.KassenbuchJahresabschluesse
            .FirstOrDefaultAsync(k => k.Id == id && k.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<KassenbuchJahresabschlussDto>(entity) : null;
    }

    public async Task<IEnumerable<KassenbuchJahresabschlussDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = _context.KassenbuchJahresabschluesse.AsQueryable();

        if (!includeDeleted)
            query = query.Where(k => k.DeletedFlag != true);

        var entities = await query.OrderByDescending(k => k.Jahr).ToListAsync(cancellationToken);
        return _mapper.Map<IEnumerable<KassenbuchJahresabschlussDto>>(entities);
    }

    public async Task<KassenbuchJahresabschlussDto> UpdateAsync(int id, UpdateKassenbuchJahresabschlussDto updateDto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.KassenbuchJahresabschluesse.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Year-end closing with ID {id} not found");
        }

        _mapper.Map(updateDto, entity);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<KassenbuchJahresabschlussDto>(entity);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.KassenbuchJahresabschluesse.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null) return false;

        entity.DeletedFlag = true;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<KassenbuchJahresabschlussDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.KassenbuchJahresabschluesse
            .Where(k => k.VereinId == vereinId && k.DeletedFlag != true)
            .OrderByDescending(k => k.Jahr)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<KassenbuchJahresabschlussDto>>(entities);
    }

    public async Task<KassenbuchJahresabschlussDto?> GetByVereinAndJahrAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        var entity = await _context.KassenbuchJahresabschluesse
            .FirstOrDefaultAsync(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<KassenbuchJahresabschlussDto>(entity) : null;
    }

    public async Task<bool> ExistsForYearAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        return await _context.KassenbuchJahresabschluesse
            .AnyAsync(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true, cancellationToken);
    }

    public async Task<KassenbuchJahresabschlussDto> MarkAsAuditedAsync(int id, string auditorName, CancellationToken cancellationToken = default)
    {
        var entity = await _context.KassenbuchJahresabschluesse.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Year-end closing with ID {id} not found");
        }

        entity.Geprueft = true;
        entity.GeprueftVon = auditorName;
        entity.GeprueftAm = DateTime.UtcNow;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<KassenbuchJahresabschlussDto>(entity);
    }

    public async Task<KassenbuchJahresabschlussDto?> GetLatestAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var entity = await _context.KassenbuchJahresabschluesse
            .Where(k => k.VereinId == vereinId && k.DeletedFlag != true)
            .OrderByDescending(k => k.Jahr)
            .FirstOrDefaultAsync(cancellationToken);

        return entity != null ? _mapper.Map<KassenbuchJahresabschlussDto>(entity) : null;
    }

    public async Task<KassenbuchJahresabschlussDto> CalculateAndCreateAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Calculating year-end closing for Verein {VereinId}, Jahr {Jahr}", vereinId, jahr);

        // Get previous year closing for opening balances
        var previousClosing = await GetByVereinAndJahrAsync(vereinId, jahr - 1, cancellationToken);

        decimal kasseAnfang = previousClosing?.KasseEndbestand ?? 0;
        decimal bankAnfang = previousClosing?.BankEndbestand ?? 0;

        // Calculate closing balances from Kassenbuch entries
        var kasseEndbestand = kasseAnfang + await _kassenbuchService.GetKasseSaldoAsync(vereinId, jahr, cancellationToken);
        var bankEndbestand = bankAnfang + await _kassenbuchService.GetBankSaldoAsync(vereinId, jahr, cancellationToken);

        var createDto = new CreateKassenbuchJahresabschlussDto
        {
            VereinId = vereinId,
            Jahr = jahr,
            KasseAnfangsbestand = kasseAnfang,
            KasseEndbestand = kasseEndbestand,
            BankAnfangsbestand = bankAnfang,
            BankEndbestand = bankEndbestand,
            AbschlussDatum = DateTime.UtcNow
        };

        return await CreateAsync(createDto, cancellationToken);
    }

    #endregion
}

