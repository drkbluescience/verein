using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.FiBuKonto;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for FiBuKonto business operations
/// </summary>
public class FiBuKontoService : IFiBuKontoService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<FiBuKontoService> _logger;

    public FiBuKontoService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<FiBuKontoService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<FiBuKontoDto> CreateAsync(CreateFiBuKontoDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new FiBuKonto with number {Nummer}", createDto.Nummer);

        if (await NummerExistsAsync(createDto.Nummer, null, cancellationToken))
        {
            throw new InvalidOperationException($"FiBuKonto with number {createDto.Nummer} already exists");
        }

        var entity = _mapper.Map<FiBuKonto>(createDto);
        _context.FiBuKonten.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully created FiBuKonto with ID {Id}", entity.Id);
        return _mapper.Map<FiBuKontoDto>(entity);
    }

    public async Task<FiBuKontoDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<FiBuKontoDto>(entity) : null;
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .AsQueryable();

        if (!includeDeleted)
            query = query.Where(f => f.DeletedFlag != true);

        var entities = await query.OrderBy(f => f.Nummer).ToListAsync(cancellationToken);
        return _mapper.Map<IEnumerable<FiBuKontoDto>>(entities);
    }

    public async Task<FiBuKontoDto> UpdateAsync(int id, UpdateFiBuKontoDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating FiBuKonto with ID {Id}", id);

        var entity = await _context.FiBuKonten.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"FiBuKonto with ID {id} not found");
        }

        if (await NummerExistsAsync(updateDto.Nummer, id, cancellationToken))
        {
            throw new InvalidOperationException($"FiBuKonto with number {updateDto.Nummer} already exists");
        }

        _mapper.Map(updateDto, entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully updated FiBuKonto with ID {Id}", id);
        return _mapper.Map<FiBuKontoDto>(entity);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting FiBuKonto with ID {Id}", id);

        var entity = await _context.FiBuKonten.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null) return false;

        entity.DeletedFlag = true;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully deleted FiBuKonto with ID {Id}", id);
        return true;
    }

    #endregion

    #region Business Operations

    public async Task<FiBuKontoDto?> GetByNummerAsync(string nummer, CancellationToken cancellationToken = default)
    {
        var entity = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .FirstOrDefaultAsync(f => f.Nummer == nummer && f.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<FiBuKontoDto>(entity) : null;
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetByTypAsync(string typ, CancellationToken cancellationToken = default)
    {
        var entities = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .Where(f => f.Typ == typ && f.DeletedFlag != true)
            .OrderBy(f => f.Nummer)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<FiBuKontoDto>>(entities);
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetByZahlungTypIdAsync(int zahlungTypId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .Where(f => f.ZahlungTypId == zahlungTypId && f.DeletedFlag != true)
            .OrderBy(f => f.Nummer)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<FiBuKontoDto>>(entities);
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetEinnahmenKontenAsync(CancellationToken cancellationToken = default)
    {
        return await GetByTypAsync("EINNAHMEN", cancellationToken);
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetAusgabenKontenAsync(CancellationToken cancellationToken = default)
    {
        return await GetByTypAsync("AUSGABEN", cancellationToken);
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetDurchlaufendePostenKontenAsync(CancellationToken cancellationToken = default)
    {
        // Durchlaufende Posten accounts start with 90xx
        var entities = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .Where(f => f.Nummer.StartsWith("90") && f.DeletedFlag != true)
            .OrderBy(f => f.Nummer)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<FiBuKontoDto>>(entities);
    }

    public async Task<IEnumerable<FiBuKontoDto>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        var entities = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .Where(f => f.IsAktiv == true && f.DeletedFlag != true)
            .OrderBy(f => f.Nummer)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<FiBuKontoDto>>(entities);
    }

    public async Task<bool> SetActiveStatusAsync(int id, bool isActive, CancellationToken cancellationToken = default)
    {
        var entity = await _context.FiBuKonten.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true) return false;

        entity.IsAktiv = isActive;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> NummerExistsAsync(string nummer, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.FiBuKonten.Where(f => f.Nummer == nummer && f.DeletedFlag != true);

        if (excludeId.HasValue)
            query = query.Where(f => f.Id != excludeId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<Dictionary<string, IEnumerable<FiBuKontoDto>>> GetGroupedByTypAsync(CancellationToken cancellationToken = default)
    {
        var entities = await _context.FiBuKonten
            .Include(f => f.ZahlungTyp)
            .Where(f => f.DeletedFlag != true)
            .OrderBy(f => f.Nummer)
            .ToListAsync(cancellationToken);

        return entities
            .GroupBy(f => f.Typ ?? "SONSTIGE")
            .ToDictionary(
                g => g.Key,
                g => _mapper.Map<IEnumerable<FiBuKontoDto>>(g.ToList())
            );
    }

    #endregion
}

