using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.DurchlaufendePosten;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for DurchlaufendePosten business operations
/// </summary>
public class DurchlaufendePostenService : IDurchlaufendePostenService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<DurchlaufendePostenService> _logger;

    public DurchlaufendePostenService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<DurchlaufendePostenService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<DurchlaufendePostenDto> CreateAsync(CreateDurchlaufendePostenDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating transit item for Verein {VereinId}", createDto.VereinId);

        var entity = _mapper.Map<DurchlaufendePosten>(createDto);
        _context.DurchlaufendePosten.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created transit item with ID {Id}", entity.Id);
        return await GetByIdAsync(entity.Id, cancellationToken) ?? _mapper.Map<DurchlaufendePostenDto>(entity);
    }

    public async Task<DurchlaufendePostenDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.DurchlaufendePosten
            .Include(d => d.FiBuKonto)
            .FirstOrDefaultAsync(d => d.Id == id && d.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<DurchlaufendePostenDto>(entity) : null;
    }

    public async Task<IEnumerable<DurchlaufendePostenDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = _context.DurchlaufendePosten.Include(d => d.FiBuKonto).AsQueryable();

        if (!includeDeleted)
            query = query.Where(d => d.DeletedFlag != true);

        var entities = await query.OrderByDescending(d => d.EinnahmenDatum).ToListAsync(cancellationToken);
        return _mapper.Map<IEnumerable<DurchlaufendePostenDto>>(entities);
    }

    public async Task<DurchlaufendePostenDto> UpdateAsync(int id, UpdateDurchlaufendePostenDto updateDto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.DurchlaufendePosten.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Transit item with ID {id} not found");
        }

        _mapper.Map(updateDto, entity);
        
        // Auto-update status based on amounts
        if (entity.AusgabenBetrag.HasValue && entity.AusgabenBetrag >= entity.EinnahmenBetrag)
            entity.Status = "ABGESCHLOSSEN";
        else if (entity.AusgabenBetrag.HasValue && entity.AusgabenBetrag > 0)
            entity.Status = "TEILWEISE";

        await _context.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken) ?? _mapper.Map<DurchlaufendePostenDto>(entity);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.DurchlaufendePosten.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null) return false;

        entity.DeletedFlag = true;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<DurchlaufendePostenDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.DurchlaufendePosten
            .Include(d => d.FiBuKonto)
            .Where(d => d.VereinId == vereinId && d.DeletedFlag != true)
            .OrderByDescending(d => d.EinnahmenDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<DurchlaufendePostenDto>>(entities);
    }

    public async Task<IEnumerable<DurchlaufendePostenDto>> GetByStatusAsync(int vereinId, string status, CancellationToken cancellationToken = default)
    {
        var entities = await _context.DurchlaufendePosten
            .Include(d => d.FiBuKonto)
            .Where(d => d.VereinId == vereinId && d.Status == status && d.DeletedFlag != true)
            .OrderByDescending(d => d.EinnahmenDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<DurchlaufendePostenDto>>(entities);
    }

    public async Task<IEnumerable<DurchlaufendePostenDto>> GetOpenAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.DurchlaufendePosten
            .Include(d => d.FiBuKonto)
            .Where(d => d.VereinId == vereinId && d.Status != "ABGESCHLOSSEN" && d.DeletedFlag != true)
            .OrderByDescending(d => d.EinnahmenDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<DurchlaufendePostenDto>>(entities);
    }

    public async Task<IEnumerable<DurchlaufendePostenDto>> GetByFiBuKontoAsync(int vereinId, string fiBuNummer, CancellationToken cancellationToken = default)
    {
        var entities = await _context.DurchlaufendePosten
            .Include(d => d.FiBuKonto)
            .Where(d => d.VereinId == vereinId && d.FiBuNummer == fiBuNummer && d.DeletedFlag != true)
            .OrderByDescending(d => d.EinnahmenDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<DurchlaufendePostenDto>>(entities);
    }

    public async Task<decimal> GetTotalOpenAmountAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        return await _context.DurchlaufendePosten
            .Where(d => d.VereinId == vereinId && d.Status != "ABGESCHLOSSEN" && d.DeletedFlag != true)
            .SumAsync(d => d.EinnahmenBetrag - (d.AusgabenBetrag ?? 0), cancellationToken);
    }

    public async Task<DurchlaufendePostenDto> CloseAsync(int id, DateTime ausgabenDatum, decimal ausgabenBetrag, string? referenz = null, CancellationToken cancellationToken = default)
    {
        var entity = await _context.DurchlaufendePosten.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Transit item with ID {id} not found");
        }

        entity.AusgabenDatum = ausgabenDatum;
        entity.AusgabenBetrag = ausgabenBetrag;
        entity.Referenz = referenz;
        entity.Status = ausgabenBetrag >= entity.EinnahmenBetrag ? "ABGESCHLOSSEN" : "TEILWEISE";
        entity.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Closed transit item with ID {Id}, Status: {Status}", id, entity.Status);
        return await GetByIdAsync(id, cancellationToken) ?? _mapper.Map<DurchlaufendePostenDto>(entity);
    }

    public async Task<IEnumerable<DurchlaufendePostenSummaryDto>> GetEmpfaengerSummaryAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var result = await _context.DurchlaufendePosten
            .Where(d => d.VereinId == vereinId && d.DeletedFlag != true)
            .GroupBy(d => d.Empfaenger ?? "Unbekannt")
            .Select(g => new DurchlaufendePostenSummaryDto
            {
                Empfaenger = g.Key,
                TotalEinnahmen = g.Sum(d => d.EinnahmenBetrag),
                TotalAusgaben = g.Sum(d => d.AusgabenBetrag ?? 0),
                OffenerBetrag = g.Sum(d => d.EinnahmenBetrag - (d.AusgabenBetrag ?? 0)),
                AnzahlPosten = g.Count()
            })
            .OrderByDescending(s => s.OffenerBetrag)
            .ToListAsync(cancellationToken);

        return result;
    }

    #endregion
}

