using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Kassenbuch;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Kassenbuch business operations
/// Uses EinnahmeKasse, AusgabeKasse, EinnahmeBank, AusgabeBank columns from entity
/// </summary>
public class KassenbuchService : IKassenbuchService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<KassenbuchService> _logger;

    public KassenbuchService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<KassenbuchService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<KassenbuchDto> CreateAsync(CreateKassenbuchDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new Kassenbuch entry for Verein {VereinId}", createDto.VereinId);

        var entity = _mapper.Map<Kassenbuch>(createDto);

        // Generate BelegNr
        entity.BelegNr = await GetNextBelegNrAsync(createDto.VereinId, entity.Jahr, cancellationToken);

        _context.Kassenbuch.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created Kassenbuch entry with ID {Id}, BelegNr {BelegNr}", entity.Id, entity.BelegNr);

        return await GetByIdAsync(entity.Id, cancellationToken) ?? _mapper.Map<KassenbuchDto>(entity);
    }

    public async Task<KassenbuchDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .FirstOrDefaultAsync(k => k.Id == id && k.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<KassenbuchDto>(entity) : null;
    }

    public async Task<IEnumerable<KassenbuchDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .AsQueryable();

        if (!includeDeleted)
            query = query.Where(k => k.DeletedFlag != true);

        var entities = await query
            .OrderByDescending(k => k.BelegDatum)
            .ThenByDescending(k => k.BelegNr)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<KassenbuchDto>>(entities);
    }

    public async Task<KassenbuchDto> UpdateAsync(int id, UpdateKassenbuchDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating Kassenbuch entry with ID {Id}", id);

        var entity = await _context.Kassenbuch.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Kassenbuch entry with ID {id} not found");
        }

        _mapper.Map(updateDto, entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully updated Kassenbuch entry with ID {Id}", id);
        return await GetByIdAsync(id, cancellationToken) ?? _mapper.Map<KassenbuchDto>(entity);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting Kassenbuch entry with ID {Id}", id);

        var entity = await _context.Kassenbuch.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null) return false;

        entity.DeletedFlag = true;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully deleted Kassenbuch entry with ID {Id}", id);
        return true;
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<KassenbuchDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .Where(k => k.VereinId == vereinId);

        if (!includeDeleted)
            query = query.Where(k => k.DeletedFlag != true);

        var entities = await query
            .OrderByDescending(k => k.BelegDatum)
            .ThenByDescending(k => k.BelegNr)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<KassenbuchDto>>(entities);
    }

    public async Task<IEnumerable<KassenbuchDto>> GetByJahrAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true)
            .OrderBy(k => k.BelegNr)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<KassenbuchDto>>(entities);
    }

    public async Task<IEnumerable<KassenbuchDto>> GetByDateRangeAsync(int vereinId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .Where(k => k.VereinId == vereinId && k.BelegDatum >= fromDate && k.BelegDatum <= toDate && k.DeletedFlag != true)
            .OrderBy(k => k.BelegDatum)
            .ThenBy(k => k.BelegNr)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<KassenbuchDto>>(entities);
    }

    public async Task<KassenbuchDto?> GetByBelegNrAsync(int vereinId, int jahr, int belegNr, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .FirstOrDefaultAsync(k => k.VereinId == vereinId && k.Jahr == jahr && k.BelegNr == belegNr && k.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<KassenbuchDto>(entity) : null;
    }

    public async Task<IEnumerable<KassenbuchDto>> GetByFiBuKontoAsync(int vereinId, string fiBuNummer, int? jahr = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .Where(k => k.VereinId == vereinId && k.FiBuNummer == fiBuNummer && k.DeletedFlag != true);

        if (jahr.HasValue)
            query = query.Where(k => k.Jahr == jahr.Value);

        var entities = await query.OrderBy(k => k.BelegDatum).ToListAsync(cancellationToken);
        return _mapper.Map<IEnumerable<KassenbuchDto>>(entities);
    }

    public async Task<IEnumerable<KassenbuchDto>> GetByZahlungswegAsync(int vereinId, string zahlungsweg, int? jahr = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Include(k => k.Mitglied)
            .Where(k => k.VereinId == vereinId && k.Zahlungsweg == zahlungsweg && k.DeletedFlag != true);

        if (jahr.HasValue)
            query = query.Where(k => k.Jahr == jahr.Value);

        var entities = await query.OrderBy(k => k.BelegDatum).ToListAsync(cancellationToken);
        return _mapper.Map<IEnumerable<KassenbuchDto>>(entities);
    }

    public async Task<int> GetNextBelegNrAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        var maxBelegNr = await _context.Kassenbuch
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr)
            .MaxAsync(k => (int?)k.BelegNr, cancellationToken);

        return (maxBelegNr ?? 0) + 1;
    }

    public async Task<decimal> GetTotalEinnahmenAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        return await _context.Kassenbuch
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true)
            .SumAsync(k => (k.EinnahmeKasse ?? 0) + (k.EinnahmeBank ?? 0), cancellationToken);
    }

    public async Task<decimal> GetTotalAusgabenAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        return await _context.Kassenbuch
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true)
            .SumAsync(k => (k.AusgabeKasse ?? 0) + (k.AusgabeBank ?? 0), cancellationToken);
    }

    public async Task<decimal> GetKasseSaldoAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        return await _context.Kassenbuch
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true)
            .SumAsync(k => (k.EinnahmeKasse ?? 0) - (k.AusgabeKasse ?? 0), cancellationToken);
    }

    public async Task<decimal> GetBankSaldoAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        return await _context.Kassenbuch
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true)
            .SumAsync(k => (k.EinnahmeBank ?? 0) - (k.AusgabeBank ?? 0), cancellationToken);
    }

    public async Task<IEnumerable<KassenbuchKontoSummaryDto>> GetKontoSummaryAsync(int vereinId, int jahr, CancellationToken cancellationToken = default)
    {
        var result = await _context.Kassenbuch
            .Include(k => k.FiBuKonto)
            .Where(k => k.VereinId == vereinId && k.Jahr == jahr && k.DeletedFlag != true)
            .GroupBy(k => new { k.FiBuNummer, Bezeichnung = k.FiBuKonto != null ? k.FiBuKonto.Bezeichnung : "" })
            .Select(g => new KassenbuchKontoSummaryDto
            {
                FiBuNummer = g.Key.FiBuNummer,
                FiBuBezeichnung = g.Key.Bezeichnung,
                TotalEinnahmen = g.Sum(k => (k.EinnahmeKasse ?? 0) + (k.EinnahmeBank ?? 0)),
                TotalAusgaben = g.Sum(k => (k.AusgabeKasse ?? 0) + (k.AusgabeBank ?? 0)),
                Saldo = g.Sum(k => (k.EinnahmeKasse ?? 0) + (k.EinnahmeBank ?? 0) - (k.AusgabeKasse ?? 0) - (k.AusgabeBank ?? 0)),
                AnzahlBuchungen = g.Count()
            })
            .OrderBy(s => s.FiBuNummer)
            .ToListAsync(cancellationToken);

        return result;
    }

    #endregion
}

