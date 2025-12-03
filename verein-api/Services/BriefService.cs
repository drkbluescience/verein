using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.Brief;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Brief (Letter Draft) business operations
/// </summary>
public class BriefService : IBriefService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<BriefService> _logger;

    public BriefService(
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<BriefService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<BriefDto> CreateAsync(CreateBriefDto createDto, CancellationToken cancellationToken = default)
    {
        var brief = _mapper.Map<Brief>(createDto);
        brief.Created = DateTime.UtcNow;
        brief.DeletedFlag = false;
        brief.Status = "Entwurf";

        _context.Briefe.Add(brief);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created Brief with ID {Id} for Verein {VereinId}", brief.Id, brief.VereinId);
        return _mapper.Map<BriefDto>(brief);
    }

    public async Task<BriefDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var brief = await _context.Briefe
            .AsNoTracking()
            .Include(b => b.Vorlage)
            .Include(b => b.Nachrichten)
                .ThenInclude(n => n.Mitglied)
            .FirstOrDefaultAsync(b => b.Id == id && b.DeletedFlag != true, cancellationToken);

        return brief == null ? null : _mapper.Map<BriefDto>(brief);
    }

    public async Task<IEnumerable<BriefDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var briefe = await _context.Briefe
            .AsNoTracking()
            .Include(b => b.Vorlage)
            .Include(b => b.Nachrichten)
            .Where(b => b.VereinId == vereinId && b.DeletedFlag != true)
            .OrderByDescending(b => b.Created)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BriefDto>>(briefe);
    }

    public async Task<IEnumerable<BriefDto>> GetDraftsByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var briefe = await _context.Briefe
            .AsNoTracking()
            .Include(b => b.Vorlage)
            .Where(b => b.VereinId == vereinId && b.DeletedFlag != true && b.Status == "Entwurf")
            .OrderByDescending(b => b.Modified ?? b.Created)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BriefDto>>(briefe);
    }

    public async Task<IEnumerable<BriefDto>> GetSentByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var briefe = await _context.Briefe
            .AsNoTracking()
            .Include(b => b.Vorlage)
            .Include(b => b.Nachrichten)
            .Where(b => b.VereinId == vereinId && b.DeletedFlag != true && b.Status == "Gesendet")
            .OrderByDescending(b => b.Modified ?? b.Created)
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<BriefDto>>(briefe);
    }

    public async Task<BriefDto> UpdateAsync(int id, UpdateBriefDto updateDto, CancellationToken cancellationToken = default)
    {
        var brief = await _context.Briefe
            .FirstOrDefaultAsync(b => b.Id == id && b.DeletedFlag != true, cancellationToken);

        if (brief == null)
            throw new KeyNotFoundException($"Brief with ID {id} not found");

        _mapper.Map(updateDto, brief);
        brief.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated Brief with ID {Id}", id);
        return _mapper.Map<BriefDto>(brief);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var brief = await _context.Briefe
            .FirstOrDefaultAsync(b => b.Id == id && b.DeletedFlag != true, cancellationToken);

        if (brief == null)
            return false;

        brief.DeletedFlag = true;
        brief.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Soft deleted Brief with ID {Id}", id);
        return true;
    }

    // Continued in next part due to length...
    public async Task<IEnumerable<NachrichtDto>> SendAsync(SendBriefDto sendDto, CancellationToken cancellationToken = default)
    {
        var brief = await _context.Briefe
            .FirstOrDefaultAsync(b => b.Id == sendDto.BriefId && b.DeletedFlag != true, cancellationToken);

        if (brief == null)
            throw new KeyNotFoundException($"Brief with ID {sendDto.BriefId} not found");

        var nachrichten = new List<Nachricht>();

        foreach (var mitgliedId in sendDto.MitgliedIds)
        {
            var processedContent = await ReplacePlaceholdersAsync(brief.Inhalt, mitgliedId, brief.VereinId, cancellationToken);
            var processedBetreff = await ReplacePlaceholdersAsync(brief.Betreff, mitgliedId, brief.VereinId, cancellationToken);

            var nachricht = new Nachricht
            {
                BriefId = brief.Id,
                VereinId = brief.VereinId,
                MitgliedId = mitgliedId,
                Betreff = processedBetreff,
                Inhalt = processedContent,
                LogoUrl = brief.LogoUrl,
                GesendetDatum = DateTime.UtcNow
            };

            nachrichten.Add(nachricht);
        }

        _context.Nachrichten.AddRange(nachrichten);
        brief.Status = "Gesendet";
        brief.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Sent Brief {BriefId} to {Count} members", brief.Id, nachrichten.Count);
        return _mapper.Map<IEnumerable<NachrichtDto>>(nachrichten);
    }

    public async Task<IEnumerable<NachrichtDto>> QuickSendAsync(QuickSendBriefDto quickSendDto, CancellationToken cancellationToken = default)
    {
        var brief = new Brief
        {
            VereinId = quickSendDto.VereinId,
            VorlageId = quickSendDto.VorlageId,
            Titel = quickSendDto.Titel,
            Betreff = quickSendDto.Betreff,
            Inhalt = quickSendDto.Inhalt,
            LogoUrl = quickSendDto.LogoUrl,
            LogoPosition = quickSendDto.LogoPosition,
            Schriftart = quickSendDto.Schriftart,
            Schriftgroesse = quickSendDto.Schriftgroesse,
            Status = "Gesendet",
            Created = DateTime.UtcNow,
            DeletedFlag = false
        };

        _context.Briefe.Add(brief);
        await _context.SaveChangesAsync(cancellationToken);

        var sendDto = new SendBriefDto { BriefId = brief.Id, MitgliedIds = quickSendDto.MitgliedIds };
        return await SendAsync(sendDto, cancellationToken);
    }

    public async Task<BriefStatisticsDto> GetStatisticsAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        return new BriefStatisticsDto
        {
            TotalVorlagen = await _context.BriefVorlagen.CountAsync(v => v.VereinId == vereinId && v.DeletedFlag != true, cancellationToken),
            TotalEntwuerfe = await _context.Briefe.CountAsync(b => b.VereinId == vereinId && b.DeletedFlag != true && b.Status == "Entwurf", cancellationToken),
            TotalGesendet = await _context.Briefe.CountAsync(b => b.VereinId == vereinId && b.DeletedFlag != true && b.Status == "Gesendet", cancellationToken),
            TotalNachrichten = await _context.Nachrichten.CountAsync(n => n.VereinId == vereinId && !n.DeletedFlag, cancellationToken),
            UngeleseneNachrichten = await _context.Nachrichten.CountAsync(n => n.VereinId == vereinId && !n.DeletedFlag && !n.IstGelesen, cancellationToken),
            GeleseneNachrichten = await _context.Nachrichten.CountAsync(n => n.VereinId == vereinId && !n.DeletedFlag && n.IstGelesen, cancellationToken)
        };
    }

    public async Task<string> ReplacePlaceholdersAsync(string content, int mitgliedId, int vereinId, CancellationToken cancellationToken = default)
    {
        var mitglied = await _context.Set<Mitglied>().AsNoTracking().FirstOrDefaultAsync(m => m.Id == mitgliedId, cancellationToken);
        var verein = await _context.Set<Verein>().AsNoTracking().FirstOrDefaultAsync(v => v.Id == vereinId, cancellationToken);

        if (mitglied == null || verein == null) return content;

        return content
            .Replace("{{vorname}}", mitglied.Vorname ?? "")
            .Replace("{{nachname}}", mitglied.Nachname ?? "")
            .Replace("{{vollname}}", $"{mitglied.Vorname} {mitglied.Nachname}".Trim())
            .Replace("{{email}}", mitglied.Email ?? "")
            .Replace("{{mitgliedsnummer}}", mitglied.Mitgliedsnummer ?? "")
            .Replace("{{vereinName}}", verein.Name ?? "")
            .Replace("{{vereinKurzname}}", verein.Kurzname ?? verein.Name ?? "")
            .Replace("{{beitragBetrag}}", mitglied.BeitragBetrag?.ToString("N2") ?? "0,00")
            .Replace("{{datum}}", DateTime.Now.ToString("dd.MM.yyyy"));
    }
}
