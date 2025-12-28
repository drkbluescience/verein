using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.SpendenProtokoll;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for SpendenProtokoll business operations
/// </summary>
public class SpendenProtokollService : ISpendenProtokollService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<SpendenProtokollService> _logger;

    public SpendenProtokollService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<SpendenProtokollService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<SpendenProtokollDto> CreateAsync(CreateSpendenProtokollDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating donation protocol for Verein {VereinId}", createDto.VereinId);

        var entity = _mapper.Map<SpendenProtokoll>(createDto);

        // Create details and calculate total
        decimal totalBetrag = 0;
        foreach (var detailDto in createDto.Details)
        {
            var detail = new SpendenProtokollDetail
            {
                Wert = detailDto.Wert,
                Anzahl = detailDto.Anzahl,
                Summe = detailDto.Wert * detailDto.Anzahl
            };
            entity.Details.Add(detail);
            totalBetrag += detail.Summe;
        }
        entity.Betrag = totalBetrag;

        _context.SpendenProtokolle.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created donation protocol with ID {Id}, Total: {Betrag}", entity.Id, entity.Betrag);
        return await GetByIdAsync(entity.Id, cancellationToken) ?? _mapper.Map<SpendenProtokollDto>(entity);
    }

    public async Task<SpendenProtokollDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SpendenProtokolle
            .Include(s => s.Details)
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedFlag != true, cancellationToken);

        return entity != null ? _mapper.Map<SpendenProtokollDto>(entity) : null;
    }

    public async Task<IEnumerable<SpendenProtokollDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        var query = _context.SpendenProtokolle.Include(s => s.Details).AsQueryable();

        if (!includeDeleted)
            query = query.Where(s => s.DeletedFlag != true);

        var entities = await query.OrderByDescending(s => s.Datum).ToListAsync(cancellationToken);
        return _mapper.Map<IEnumerable<SpendenProtokollDto>>(entities);
    }

    public async Task<SpendenProtokollDto> UpdateAsync(int id, UpdateSpendenProtokollDto updateDto, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SpendenProtokolle.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Donation protocol with ID {id} not found");
        }

        _mapper.Map(updateDto, entity);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken) ?? _mapper.Map<SpendenProtokollDto>(entity);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SpendenProtokolle.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null) return false;

        entity.DeletedFlag = true;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<SpendenProtokollDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.SpendenProtokolle
            .Include(s => s.Details)
            .Where(s => s.VereinId == vereinId && s.DeletedFlag != true)
            .OrderByDescending(s => s.Datum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<SpendenProtokollDto>>(entities);
    }

    public async Task<IEnumerable<SpendenProtokollDto>> GetByDateRangeAsync(int vereinId, DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        var entities = await _context.SpendenProtokolle
            .Include(s => s.Details)
            .Where(s => s.VereinId == vereinId && s.Datum >= fromDate && s.Datum <= toDate && s.DeletedFlag != true)
            .OrderByDescending(s => s.Datum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<SpendenProtokollDto>>(entities);
    }

    public async Task<IEnumerable<SpendenProtokollDto>> GetByZweckKategorieAsync(int vereinId, string zweckKategorie, CancellationToken cancellationToken = default)
    {
        var entities = await _context.SpendenProtokolle
            .Include(s => s.Details)
            .Where(s => s.VereinId == vereinId && s.ZweckKategorie == zweckKategorie && s.DeletedFlag != true)
            .OrderByDescending(s => s.Datum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<SpendenProtokollDto>>(entities);
    }

    public async Task<decimal> GetTotalAmountAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        var query = _context.SpendenProtokolle.Where(s => s.VereinId == vereinId && s.DeletedFlag != true);

        if (fromDate.HasValue)
            query = query.Where(s => s.Datum >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(s => s.Datum <= toDate.Value);

        return await query.SumAsync(s => s.Betrag, cancellationToken);
    }

    public async Task<IEnumerable<SpendenKategorieSummaryDto>> GetKategorieSummaryAsync(int vereinId, int? jahr = null, CancellationToken cancellationToken = default)
    {
        var query = _context.SpendenProtokolle.Where(s => s.VereinId == vereinId && s.DeletedFlag != true);

        if (jahr.HasValue)
            query = query.Where(s => s.Datum.Year == jahr.Value);

        var result = await query
            .GroupBy(s => s.ZweckKategorie ?? "SONSTIGE")
            .Select(g => new SpendenKategorieSummaryDto
            {
                ZweckKategorie = g.Key,
                TotalBetrag = g.Sum(s => s.Betrag),
                AnzahlProtokolle = g.Count()
            })
            .OrderByDescending(s => s.TotalBetrag)
            .ToListAsync(cancellationToken);

        return result;
    }

    public async Task<SpendenProtokollDto> SignAsync(int id, int zeugeNumber, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SpendenProtokolle.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Donation protocol with ID {id} not found");
        }

        switch (zeugeNumber)
        {
            case 1:
                entity.Zeuge1Unterschrift = true;
                break;
            case 2:
                entity.Zeuge2Unterschrift = true;
                break;
            case 3:
                entity.Zeuge3Unterschrift = true;
                break;
            default:
                throw new ArgumentException("Invalid witness number. Must be 1, 2, or 3.");
        }

        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken) ?? _mapper.Map<SpendenProtokollDto>(entity);
    }

    public async Task<SpendenProtokollDto> LinkToKassenbuchAsync(int id, int kassenbuchId, CancellationToken cancellationToken = default)
    {
        var entity = await _context.SpendenProtokolle.FindAsync(new object[] { id }, cancellationToken);
        if (entity == null || entity.DeletedFlag == true)
        {
            throw new KeyNotFoundException($"Donation protocol with ID {id} not found");
        }

        entity.KassenbuchId = kassenbuchId;
        entity.Modified = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken) ?? _mapper.Map<SpendenProtokollDto>(entity);
    }

    #endregion
}

