using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Brief;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Nachricht (Sent Message) business operations
/// </summary>
public class NachrichtService : INachrichtService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<NachrichtService> _logger;

    public NachrichtService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<NachrichtService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<NachrichtDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var nachricht = await _context.Nachrichten
            .AsNoTracking()
            .Include(n => n.Verein)
            .Include(n => n.Mitglied)
            .Include(n => n.Brief)
            .FirstOrDefaultAsync(n => n.Id == id && !n.DeletedFlag, cancellationToken);

        return nachricht == null ? null : _mapper.Map<NachrichtDto>(nachricht);
    }

    public async Task<IEnumerable<NachrichtDto>> GetByMitgliedIdAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        var nachrichten = await _context.Nachrichten
            .AsNoTracking()
            .Include(n => n.Verein)
            .Include(n => n.Brief)
            .Where(n => n.MitgliedId == mitgliedId && !n.DeletedFlag)
            .OrderByDescending(n => n.GesendetDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<NachrichtDto>>(nachrichten);
    }

    public async Task<IEnumerable<NachrichtDto>> GetUnreadByMitgliedIdAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        var nachrichten = await _context.Nachrichten
            .AsNoTracking()
            .Include(n => n.Verein)
            .Include(n => n.Brief)
            .Where(n => n.MitgliedId == mitgliedId && !n.DeletedFlag && !n.IstGelesen)
            .OrderByDescending(n => n.GesendetDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<NachrichtDto>>(nachrichten);
    }

    public async Task<IEnumerable<NachrichtDto>> GetByBriefIdAsync(int briefId, CancellationToken cancellationToken = default)
    {
        var nachrichten = await _context.Nachrichten
            .AsNoTracking()
            .Include(n => n.Mitglied)
            .Where(n => n.BriefId == briefId && !n.DeletedFlag)
            .OrderByDescending(n => n.GesendetDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<NachrichtDto>>(nachrichten);
    }

    public async Task<IEnumerable<NachrichtDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var nachrichten = await _context.Nachrichten
            .AsNoTracking()
            .Include(n => n.Mitglied)
            .Include(n => n.Brief)
            .Where(n => n.VereinId == vereinId && !n.DeletedFlag)
            .OrderByDescending(n => n.GesendetDatum)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<NachrichtDto>>(nachrichten);
    }

    public async Task<NachrichtDto> MarkAsReadAsync(int id, CancellationToken cancellationToken = default)
    {
        var nachricht = await _context.Nachrichten
            .Include(n => n.Verein)
            .Include(n => n.Brief)
            .FirstOrDefaultAsync(n => n.Id == id && !n.DeletedFlag, cancellationToken);

        if (nachricht == null)
            throw new KeyNotFoundException($"Nachricht with ID {id} not found");

        if (!nachricht.IstGelesen)
        {
            nachricht.IstGelesen = true;
            nachricht.GelesenDatum = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Marked Nachricht {Id} as read", id);
        }

        return _mapper.Map<NachrichtDto>(nachricht);
    }

    public async Task<int> MarkMultipleAsReadAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
    {
        var nachrichten = await _context.Nachrichten
            .Where(n => ids.Contains(n.Id) && !n.DeletedFlag && !n.IstGelesen)
            .ToListAsync(cancellationToken);

        foreach (var nachricht in nachrichten)
        {
            nachricht.IstGelesen = true;
            nachricht.GelesenDatum = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Marked {Count} messages as read", nachrichten.Count);
        return nachrichten.Count;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var nachricht = await _context.Nachrichten.FirstOrDefaultAsync(n => n.Id == id && !n.DeletedFlag, cancellationToken);
        if (nachricht == null) return false;

        nachricht.DeletedFlag = true;
        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Soft deleted Nachricht with ID {Id}", id);
        return true;
    }

    public async Task<int> GetUnreadCountAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        return await _context.Nachrichten.CountAsync(n => n.MitgliedId == mitgliedId && !n.DeletedFlag && !n.IstGelesen, cancellationToken);
    }

    public async Task<BriefStatisticsDto> GetMemberStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        return new BriefStatisticsDto
        {
            TotalNachrichten = await _context.Nachrichten.CountAsync(n => n.MitgliedId == mitgliedId && !n.DeletedFlag, cancellationToken),
            UngeleseneNachrichten = await _context.Nachrichten.CountAsync(n => n.MitgliedId == mitgliedId && !n.DeletedFlag && !n.IstGelesen, cancellationToken),
            GeleseneNachrichten = await _context.Nachrichten.CountAsync(n => n.MitgliedId == mitgliedId && !n.DeletedFlag && n.IstGelesen, cancellationToken)
        };
    }
}

