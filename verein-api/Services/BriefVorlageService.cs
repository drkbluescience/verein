using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Brief;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for BriefVorlage (Letter Template) business operations
/// </summary>
public class BriefVorlageService : IBriefVorlageService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<BriefVorlageService> _logger;

    public BriefVorlageService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<BriefVorlageService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<BriefVorlageDto> CreateAsync(CreateBriefVorlageDto createDto, CancellationToken cancellationToken = default)
    {
        var vorlage = _mapper.Map<BriefVorlage>(createDto);
        vorlage.Created = DateTime.UtcNow;
        vorlage.DeletedFlag = false;

        _context.BriefVorlagen.Add(vorlage);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created BriefVorlage with ID {Id} for Verein {VereinId}", vorlage.Id, vorlage.VereinId);
        return _mapper.Map<BriefVorlageDto>(vorlage);
    }

    public async Task<BriefVorlageDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var vorlage = await _context.BriefVorlagen
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id && v.DeletedFlag != true, cancellationToken);

        return vorlage == null ? null : _mapper.Map<BriefVorlageDto>(vorlage);
    }

    public async Task<IEnumerable<BriefVorlageDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var vorlagen = await _context.BriefVorlagen
            .AsNoTracking()
            .Where(v => v.VereinId == vereinId && v.DeletedFlag != true)
            .OrderBy(v => v.Kategorie)
            .ThenBy(v => v.Name)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BriefVorlageDto>>(vorlagen);
    }

    public async Task<IEnumerable<BriefVorlageDto>> GetActiveByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var vorlagen = await _context.BriefVorlagen
            .AsNoTracking()
            .Where(v => v.VereinId == vereinId && v.DeletedFlag != true && v.IstAktiv)
            .OrderBy(v => v.Kategorie)
            .ThenBy(v => v.Name)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BriefVorlageDto>>(vorlagen);
    }

    public async Task<IEnumerable<BriefVorlageDto>> GetByCategoryAsync(int vereinId, string kategorie, CancellationToken cancellationToken = default)
    {
        var vorlagen = await _context.BriefVorlagen
            .AsNoTracking()
            .Where(v => v.VereinId == vereinId && v.DeletedFlag != true && v.IstAktiv && v.Kategorie == kategorie)
            .OrderBy(v => v.Name)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BriefVorlageDto>>(vorlagen);
    }

    public async Task<BriefVorlageDto> UpdateAsync(int id, UpdateBriefVorlageDto updateDto, CancellationToken cancellationToken = default)
    {
        var vorlage = await _context.BriefVorlagen
            .FirstOrDefaultAsync(v => v.Id == id && v.DeletedFlag != true, cancellationToken);

        if (vorlage == null)
            throw new KeyNotFoundException($"BriefVorlage with ID {id} not found");

        if (vorlage.IstSystemvorlage)
            throw new InvalidOperationException("System templates cannot be modified");

        _mapper.Map(updateDto, vorlage);
        vorlage.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated BriefVorlage with ID {Id}", id);
        return _mapper.Map<BriefVorlageDto>(vorlage);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var vorlage = await _context.BriefVorlagen
            .FirstOrDefaultAsync(v => v.Id == id && v.DeletedFlag != true, cancellationToken);

        if (vorlage == null)
            return false;

        if (vorlage.IstSystemvorlage)
            throw new InvalidOperationException("System templates cannot be deleted");

        vorlage.DeletedFlag = true;
        vorlage.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Soft deleted BriefVorlage with ID {Id}", id);
        return true;
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var categories = await _context.BriefVorlagen
            .AsNoTracking()
            .Where(v => v.VereinId == vereinId && v.DeletedFlag != true && v.Kategorie != null)
            .Select(v => v.Kategorie!)
            .Distinct()
            .OrderBy(k => k)
            .ToListAsync(cancellationToken);

        return categories;
    }
}

