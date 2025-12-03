using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.VereinSatzung;

namespace VereinsApi.Services;

/// <summary>
/// Service for VereinSatzung operations
/// </summary>
public class VereinSatzungService : IVereinSatzungService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<VereinSatzungService> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _uploadPath;

    public VereinSatzungService(
        ApplicationDbContext context,
        ILogger<VereinSatzungService> logger,
        IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
        
        // Get upload path from configuration or use default
        _uploadPath = _configuration["FileUpload:SatzungPath"] ?? Path.Combine("uploads", "satzungen");
        
        // Ensure upload directory exists
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    public async Task<IEnumerable<VereinSatzungDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var satzungen = await _context.VereinSatzungen
            .Where(s => s.VereinId == vereinId && s.DeletedFlag != true)
            .OrderByDescending(s => s.SatzungVom)
            .ToListAsync(cancellationToken);

        return satzungen.Select(MapToDto);
    }

    public async Task<VereinSatzungDto?> GetActiveByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        var satzung = await _context.VereinSatzungen
            .Where(s => s.VereinId == vereinId && s.Aktiv && s.DeletedFlag != true)
            .OrderByDescending(s => s.SatzungVom)
            .FirstOrDefaultAsync(cancellationToken);

        return satzung != null ? MapToDto(satzung) : null;
    }

    public async Task<VereinSatzungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var satzung = await _context.VereinSatzungen
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedFlag != true, cancellationToken);

        return satzung != null ? MapToDto(satzung) : null;
    }

    public async Task<VereinSatzungDto> CreateAsync(CreateVereinSatzungDto createDto, CancellationToken cancellationToken = default)
    {
        // If setting as active, deactivate all others for this Verein
        if (createDto.Aktiv)
        {
            await DeactivateAllForVereinAsync(createDto.VereinId, cancellationToken);
        }

        var satzung = new VereinSatzung
        {
            VereinId = createDto.VereinId,
            DosyaPfad = createDto.DosyaPfad,
            SatzungVom = createDto.SatzungVom,
            Aktiv = createDto.Aktiv,
            Bemerkung = createDto.Bemerkung,
            DosyaAdi = createDto.DosyaAdi,
            DosyaBoyutu = createDto.DosyaBoyutu,
            Created = DateTime.UtcNow
        };

        _context.VereinSatzungen.Add(satzung);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created new statute version {Id} for Verein {VereinId}", satzung.Id, satzung.VereinId);

        return MapToDto(satzung);
    }

    public async Task<VereinSatzungDto> UpdateAsync(int id, UpdateVereinSatzungDto updateDto, CancellationToken cancellationToken = default)
    {
        var satzung = await _context.VereinSatzungen
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedFlag != true, cancellationToken);

        if (satzung == null)
        {
            throw new KeyNotFoundException($"VereinSatzung with ID {id} not found");
        }

        // If setting as active, deactivate all others for this Verein
        if (updateDto.Aktiv == true && !satzung.Aktiv)
        {
            await DeactivateAllForVereinAsync(satzung.VereinId, cancellationToken);
        }

        if (updateDto.SatzungVom.HasValue)
            satzung.SatzungVom = updateDto.SatzungVom.Value;

        if (updateDto.Aktiv.HasValue)
            satzung.Aktiv = updateDto.Aktiv.Value;

        if (updateDto.Bemerkung != null)
            satzung.Bemerkung = updateDto.Bemerkung;

        satzung.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated statute version {Id}", id);

        return MapToDto(satzung);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var satzung = await _context.VereinSatzungen
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedFlag != true, cancellationToken);

        if (satzung == null)
        {
            return false;
        }

        satzung.DeletedFlag = true;
        satzung.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Soft deleted statute version {Id}", id);

        return true;
    }

    public async Task<VereinSatzungDto> UploadSatzungAsync(
        int vereinId,
        byte[] fileContent,
        string fileName,
        string contentType,
        DateTime satzungVom,
        bool setAsActive = true,
        string? bemerkung = null,
        CancellationToken cancellationToken = default)
    {
        // Validate file type (Word documents only)
        var allowedExtensions = new[] { ".doc", ".docx" };
        var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new ArgumentException($"Invalid file type. Only Word documents (.doc, .docx) are allowed. Received: {fileExtension}");
        }

        // Validate file size (max 10 MB)
        const long maxFileSize = 10 * 1024 * 1024; // 10 MB
        if (fileContent.Length > maxFileSize)
        {
            throw new ArgumentException($"File size exceeds maximum allowed size of 10 MB. File size: {fileContent.Length / 1024 / 1024} MB");
        }

        // Create verein-specific folder
        var vereinFolderPath = Path.Combine(_uploadPath, $"verein_{vereinId}");
        if (!Directory.Exists(vereinFolderPath))
        {
            Directory.CreateDirectory(vereinFolderPath);
        }

        // Generate unique file name
        var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
        var uniqueFileName = $"satzung_{timestamp}{fileExtension}";
        var relativePath = Path.Combine("uploads", "satzungen", $"verein_{vereinId}", uniqueFileName);
        var fullPath = Path.Combine(vereinFolderPath, uniqueFileName);

        // Write file to disk
        await File.WriteAllBytesAsync(fullPath, fileContent, cancellationToken);

        _logger.LogInformation("Statute file saved to {FilePath}", fullPath);

        var createDto = new CreateVereinSatzungDto
        {
            VereinId = vereinId,
            DosyaPfad = relativePath,
            SatzungVom = satzungVom,
            Aktiv = setAsActive,
            Bemerkung = bemerkung,
            DosyaAdi = fileName,
            DosyaBoyutu = fileContent.Length
        };

        return await CreateAsync(createDto, cancellationToken);
    }

    public async Task<bool> SetActiveAsync(int id, CancellationToken cancellationToken = default)
    {
        var satzung = await _context.VereinSatzungen
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedFlag != true, cancellationToken);

        if (satzung == null)
        {
            return false;
        }

        // Deactivate all others for this Verein
        await DeactivateAllForVereinAsync(satzung.VereinId, cancellationToken);

        // Activate this one
        satzung.Aktiv = true;
        satzung.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Set statute version {Id} as active for Verein {VereinId}", id, satzung.VereinId);

        return true;
    }

    public async Task<FileDataDto?> GetFileAsync(int id, CancellationToken cancellationToken = default)
    {
        var satzung = await _context.VereinSatzungen
            .FirstOrDefaultAsync(s => s.Id == id && s.DeletedFlag != true, cancellationToken);

        if (satzung == null)
        {
            return null;
        }

        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), satzung.DosyaPfad);

        if (!File.Exists(fullPath))
        {
            _logger.LogWarning("Statute file not found at {FilePath}", fullPath);
            return null;
        }

        var content = await File.ReadAllBytesAsync(fullPath, cancellationToken);
        var fileName = satzung.DosyaAdi ?? $"satzung_{satzung.Id}.docx";
        var contentType = Path.GetExtension(fileName).ToLowerInvariant() == ".doc"
            ? "application/msword"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        return new FileDataDto
        {
            Content = content,
            FileName = fileName,
            ContentType = contentType
        };
    }

    private async Task DeactivateAllForVereinAsync(int vereinId, CancellationToken cancellationToken)
    {
        var activeSatzungen = await _context.VereinSatzungen
            .Where(s => s.VereinId == vereinId && s.Aktiv && s.DeletedFlag != true)
            .ToListAsync(cancellationToken);

        foreach (var satzung in activeSatzungen)
        {
            satzung.Aktiv = false;
            satzung.Modified = DateTime.UtcNow;
        }

        if (activeSatzungen.Any())
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    private VereinSatzungDto MapToDto(VereinSatzung satzung)
    {
        return new VereinSatzungDto
        {
            Id = satzung.Id,
            VereinId = satzung.VereinId,
            DosyaPfad = satzung.DosyaPfad,
            SatzungVom = satzung.SatzungVom,
            Aktiv = satzung.Aktiv,
            Bemerkung = satzung.Bemerkung,
            DosyaAdi = satzung.DosyaAdi,
            DosyaBoyutu = satzung.DosyaBoyutu,
            Created = satzung.Created,
            CreatedBy = satzung.CreatedBy,
            Modified = satzung.Modified,
            ModifiedBy = satzung.ModifiedBy,
            DeletedFlag = satzung.DeletedFlag
        };
    }
}
