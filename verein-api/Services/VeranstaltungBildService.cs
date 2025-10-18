using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.VeranstaltungBild;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for VeranstaltungBild business operations
/// </summary>
public class VeranstaltungBildService : IVeranstaltungBildService
{
    private readonly IRepository<VeranstaltungBild> _bildRepository;
    private readonly IRepository<Veranstaltung> _veranstaltungRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<VeranstaltungBildService> _logger;

    // Configuration constants
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
    private readonly string[] _allowedContentTypes = { "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp" };
    private readonly long _maxFileSize = 10 * 1024 * 1024; // 10 MB

    public VeranstaltungBildService(
        IRepository<VeranstaltungBild> bildRepository,
        IRepository<Veranstaltung> veranstaltungRepository,
        IMapper mapper,
        ILogger<VeranstaltungBildService> logger)
    {
        _bildRepository = bildRepository;
        _veranstaltungRepository = veranstaltungRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<VeranstaltungBildDto> CreateAsync(CreateVeranstaltungBildDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new veranstaltung bild for Veranstaltung {VeranstaltungId}", createDto.VeranstaltungId);

        try
        {
            // Validate business rules
            await ValidateCreateAsync(createDto, cancellationToken);

            var bild = _mapper.Map<VeranstaltungBild>(createDto);
            // Upload date is handled by Created field in AuditableEntity
            
            var createdBild = await _bildRepository.AddAsync(bild, cancellationToken);
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created veranstaltung bild with ID {BildId}", createdBild.Id);
            return _mapper.Map<VeranstaltungBildDto>(createdBild);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating veranstaltung bild for Veranstaltung {VeranstaltungId}", createDto.VeranstaltungId);
            throw;
        }
    }

    public async Task<VeranstaltungBildDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltung bild by ID {BildId}", id);

        var bild = await _bildRepository.GetByIdAsync(id, false, cancellationToken);
        return bild != null ? _mapper.Map<VeranstaltungBildDto>(bild) : null;
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all veranstaltung bilder, includeDeleted: {IncludeDeleted}", includeDeleted);

        var bilder = await _bildRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<VeranstaltungBildDto> UpdateAsync(int id, UpdateVeranstaltungBildDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating veranstaltung bild {BildId}", id);

        try
        {
            var existingBild = await _bildRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingBild == null)
            {
                throw new ArgumentException($"VeranstaltungBild with ID {id} not found");
            }

            // Validate business rules
            await ValidateUpdateAsync(id, updateDto, cancellationToken);

            _mapper.Map(updateDto, existingBild);
            
            var updatedBild = await _bildRepository.UpdateAsync(existingBild, cancellationToken);
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated veranstaltung bild {BildId}", id);
            return _mapper.Map<VeranstaltungBildDto>(updatedBild);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating veranstaltung bild {BildId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting veranstaltung bild {BildId}", id);

        try
        {
            var bild = await _bildRepository.GetByIdAsync(id, false, cancellationToken);
            if (bild == null)
            {
                _logger.LogWarning("VeranstaltungBild {BildId} not found for deletion", id);
                return false;
            }

            await _bildRepository.DeleteAsync(bild, cancellationToken);
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft deleted veranstaltung bild {BildId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting veranstaltung bild {BildId}", id);
            throw;
        }
    }

    public async Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("Hard deleting veranstaltung bild {BildId}", id);

        try
        {
            await _bildRepository.HardDeleteAsync(id, cancellationToken);
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully hard deleted veranstaltung bild {BildId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hard deleting veranstaltung bild {BildId}", id);
            throw;
        }
    }

    #endregion

    #region Query Operations

    public async Task<IEnumerable<VeranstaltungBildDto>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bilder for Veranstaltung {VeranstaltungId}", veranstaltungId);

        var bilder = await _bildRepository.GetAsync(b => b.VeranstaltungId == veranstaltungId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> SearchByFileNameAsync(string fileName, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Searching bilder by file name {FileName}", fileName);

        // Search by BildPfad since DateiName property doesn't exist
        var bilder = await _bildRepository.GetAsync(b => b.BildPfad != null && b.BildPfad.Contains(fileName), false, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> SearchByDescriptionAsync(string description, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Searching bilder by description {Description}", description);

        // Search by Titel since Beschreibung property doesn't exist
        var bilder = await _bildRepository.GetAsync(b => b.Titel != null && b.Titel.Contains(description), false, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> GetByFileTypeAsync(string fileType, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bilder by file type {FileType}", fileType);

        // Search by file extension in BildPfad since DateiTyp property doesn't exist
        var bilder = await _bildRepository.GetAsync(b => b.BildPfad != null && b.BildPfad.EndsWith($".{fileType}"), false, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> GetByFileSizeRangeAsync(long minSize, long maxSize, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bilder by file size range {MinSize} - {MaxSize}", minSize, maxSize);

        // DateiGroesse property doesn't exist, return all images for now
        // TODO: Implement file size tracking if needed
        var bilder = await _bildRepository.GetAllAsync(false, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> GetByUploadDateRangeAsync(DateTime startDate, DateTime endDate, int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bilder by upload date range {StartDate} - {EndDate}", startDate, endDate);

        // Use Created field instead of UploadDatum
        var bilder = await _bildRepository.GetAsync(b =>
            b.Created >= startDate &&
            b.Created <= endDate &&
            (veranstaltungId == null || b.VeranstaltungId == veranstaltungId),
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> GetActiveAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active bilder");

        var bilder = await _bildRepository.GetAsync(b => 
            b.Aktiv == true &&
            (veranstaltungId == null || b.VeranstaltungId == veranstaltungId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    public async Task<IEnumerable<VeranstaltungBildDto>> GetMainBilderAsync(int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting main bilder");

        // Since IstHauptbild doesn't exist, get the first image (lowest Reihenfolge) for each event
        var bilder = await _bildRepository.GetAsync(b =>
            b.Reihenfolge == 1 &&
            (veranstaltungId == null || b.VeranstaltungId == veranstaltungId),
            false, cancellationToken);

        return _mapper.Map<IEnumerable<VeranstaltungBildDto>>(bilder);
    }

    #endregion

    #region File Operations

    public async Task<VeranstaltungBildDto> UploadImageAsync(int veranstaltungId, byte[] fileContent, string fileName, string contentType, string? description = null, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Uploading image {FileName} for Veranstaltung {VeranstaltungId}", fileName, veranstaltungId);

        try
        {
            // Validate file
            if (!ValidateImageFile(fileContent, fileName, contentType))
            {
                throw new ArgumentException("Invalid image file");
            }

            // Validate veranstaltung exists
            var veranstaltung = await _veranstaltungRepository.GetByIdAsync(veranstaltungId, false, cancellationToken);
            if (veranstaltung == null)
            {
                throw new ArgumentException($"Veranstaltung with ID {veranstaltungId} not found");
            }

            // Generate unique file name
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var relativePath = $"/images/veranstaltungen/{veranstaltungId}/{uniqueFileName}";

            // Save file to wwwroot
            var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var eventFolderPath = Path.Combine(wwwrootPath, "images", "veranstaltungen", veranstaltungId.ToString());

            // Create directory if it doesn't exist
            if (!Directory.Exists(eventFolderPath))
            {
                Directory.CreateDirectory(eventFolderPath);
            }

            var fullPath = Path.Combine(eventFolderPath, uniqueFileName);

            // Write file to disk
            await File.WriteAllBytesAsync(fullPath, fileContent, cancellationToken);

            _logger.LogInformation("Image saved to {FilePath}", fullPath);

            var createDto = new CreateVeranstaltungBildDto
            {
                VeranstaltungId = veranstaltungId,
                BildPfad = relativePath,
                Titel = description ?? fileName,
                Reihenfolge = await GetNextSortOrderForEventAsync(veranstaltungId, cancellationToken)
            };

            return await CreateAsync(createDto, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image {FileName} for Veranstaltung {VeranstaltungId}", fileName, veranstaltungId);
            throw;
        }
    }

    public async Task<byte[]?> GetImageContentAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting image content for bild {BildId}", id);

        var bild = await _bildRepository.GetByIdAsync(id, false, cancellationToken);
        if (bild == null || string.IsNullOrEmpty(bild.BildPfad))
        {
            return null;
        }

        // TODO: Load file from storage
        // For now, return null as we don't have actual file storage implemented
        return null;
    }

    public bool ValidateImageFile(byte[] fileContent, string fileName, string contentType)
    {
        // Check file size
        if (fileContent.Length > _maxFileSize)
        {
            _logger.LogWarning("File {FileName} exceeds maximum size limit", fileName);
            return false;
        }

        // Check file extension
        var extension = Path.GetExtension(fileName).ToLower();
        if (!_allowedExtensions.Contains(extension))
        {
            _logger.LogWarning("File {FileName} has unsupported extension {Extension}", fileName, extension);
            return false;
        }

        // Check content type
        if (!_allowedContentTypes.Contains(contentType.ToLower()))
        {
            _logger.LogWarning("File {FileName} has unsupported content type {ContentType}", fileName, contentType);
            return false;
        }

        // Basic file signature validation
        if (!IsValidImageSignature(fileContent))
        {
            _logger.LogWarning("File {FileName} has invalid image signature", fileName);
            return false;
        }

        return true;
    }

    public IEnumerable<string> GetAllowedImageExtensions()
    {
        return _allowedExtensions;
    }

    public long GetMaxFileSize()
    {
        return _maxFileSize;
    }

    #endregion

    #region Business Operations

    public async Task<bool> SetAsMainImageAsync(int veranstaltungId, int bildId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting bild {BildId} as main image for Veranstaltung {VeranstaltungId}", bildId, veranstaltungId);

        try
        {
            // Since IstHauptbild doesn't exist, we'll use Reihenfolge to determine main image
            // Set the target image to Reihenfolge = 1 and increment others
            var targetImage = await _bildRepository.GetByIdAsync(bildId, false, cancellationToken);
            if (targetImage == null || targetImage.VeranstaltungId != veranstaltungId)
            {
                throw new ArgumentException($"Image {bildId} not found or does not belong to Veranstaltung {veranstaltungId}");
            }

            // Get all images for this event and reorder them
            var allImages = await _bildRepository.GetAsync(b => b.VeranstaltungId == veranstaltungId, false, cancellationToken);
            var imagesList = allImages.ToList();

            // Set target image to order 1
            targetImage.Reihenfolge = 1;
            await _bildRepository.UpdateAsync(targetImage, cancellationToken);

            // Increment order for other images
            int order = 2;
            foreach (var image in imagesList.Where(i => i.Id != bildId))
            {
                image.Reihenfolge = order++;
                await _bildRepository.UpdateAsync(image, cancellationToken);
            }
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully set bild {BildId} as main image for Veranstaltung {VeranstaltungId}", bildId, veranstaltungId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting bild {BildId} as main image for Veranstaltung {VeranstaltungId}", bildId, veranstaltungId);
            throw;
        }
    }

    public async Task<int> GetImageCountAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting image count for Veranstaltung {VeranstaltungId}, activeOnly: {ActiveOnly}", veranstaltungId, activeOnly);

        return await _bildRepository.CountAsync(b => 
            b.VeranstaltungId == veranstaltungId && 
            (!activeOnly || b.Aktiv == true), 
            false, cancellationToken);
    }

    public async Task<long> GetTotalFileSizeAsync(int veranstaltungId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total file size for Veranstaltung {VeranstaltungId}, activeOnly: {ActiveOnly}", veranstaltungId, activeOnly);

        var bilder = await _bildRepository.GetAsync(b => 
            b.VeranstaltungId == veranstaltungId && 
            (!activeOnly || b.Aktiv == true), 
            false, cancellationToken);

        // DateiGroesse property doesn't exist, return 0 for now
        // TODO: Implement file size tracking if needed
        return 0;
    }

    public async Task<bool> HasImagesAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if Veranstaltung {VeranstaltungId} has images", veranstaltungId);

        return await _bildRepository.ExistsAsync(b => b.VeranstaltungId == veranstaltungId, false, cancellationToken);
    }

    public async Task<bool> ActivateAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Activating veranstaltung bild {BildId}", id);

        try
        {
            var bild = await _bildRepository.GetByIdAsync(id, false, cancellationToken);
            if (bild == null)
            {
                return false;
            }

            bild.Aktiv = true;
            await _bildRepository.UpdateAsync(bild, cancellationToken);
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully activated veranstaltung bild {BildId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error activating veranstaltung bild {BildId}", id);
            throw;
        }
    }

    public async Task<bool> DeactivateAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deactivating veranstaltung bild {BildId}", id);

        try
        {
            var bild = await _bildRepository.GetByIdAsync(id, false, cancellationToken);
            if (bild == null)
            {
                return false;
            }

            bild.Aktiv = false;
            await _bildRepository.UpdateAsync(bild, cancellationToken);
            await _bildRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully deactivated veranstaltung bild {BildId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deactivating veranstaltung bild {BildId}", id);
            throw;
        }
    }

    #endregion

    #region Private Methods

    private async Task<int> GetNextSortOrderForEventAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        var existingImages = await _bildRepository.GetAsync(b => b.VeranstaltungId == veranstaltungId, false, cancellationToken);
        if (!existingImages.Any())
        {
            return 1;
        }

        return existingImages.Max(b => b.Reihenfolge) + 1;
    }

    private async Task ValidateCreateAsync(CreateVeranstaltungBildDto createDto, CancellationToken cancellationToken)
    {
        // Validate that veranstaltung exists
        var veranstaltung = await _veranstaltungRepository.GetByIdAsync(createDto.VeranstaltungId, false, cancellationToken);
        if (veranstaltung == null)
        {
            throw new ArgumentException($"Veranstaltung with ID {createDto.VeranstaltungId} not found");
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(createDto.BildPfad))
        {
            throw new ArgumentException("Image path is required");
        }
    }

    private async Task ValidateUpdateAsync(int id, UpdateVeranstaltungBildDto updateDto, CancellationToken cancellationToken)
    {
        // Add validation logic as needed
        await Task.CompletedTask;
    }

    private bool IsValidImageSignature(byte[] fileContent)
    {
        if (fileContent.Length < 4)
            return false;

        // Check for common image file signatures
        var signature = fileContent.Take(4).ToArray();

        // JPEG
        if (signature[0] == 0xFF && signature[1] == 0xD8)
            return true;

        // PNG
        if (signature[0] == 0x89 && signature[1] == 0x50 && signature[2] == 0x4E && signature[3] == 0x47)
            return true;

        // GIF
        if (signature[0] == 0x47 && signature[1] == 0x49 && signature[2] == 0x46)
            return true;

        // BMP
        if (signature[0] == 0x42 && signature[1] == 0x4D)
            return true;

        // WebP (need to check more bytes)
        if (fileContent.Length >= 12 && 
            signature[0] == 0x52 && signature[1] == 0x49 && signature[2] == 0x46 && signature[3] == 0x46 &&
            fileContent[8] == 0x57 && fileContent[9] == 0x45 && fileContent[10] == 0x42 && fileContent[11] == 0x50)
            return true;

        return false;
    }

    public async Task<object> GetImageStatisticsAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting image statistics for Veranstaltung {VeranstaltungId}", veranstaltungId);

        try
        {
            var totalImages = await GetImageCountAsync(veranstaltungId, false, cancellationToken);
            var activeImages = await GetImageCountAsync(veranstaltungId, true, cancellationToken);
            var totalFileSize = await GetTotalFileSizeAsync(veranstaltungId, false, cancellationToken);
            var activeFileSize = await GetTotalFileSizeAsync(veranstaltungId, true, cancellationToken);

            return new
            {
                VeranstaltungId = veranstaltungId,
                TotalImages = totalImages,
                ActiveImages = activeImages,
                TotalFileSize = totalFileSize,
                ActiveFileSize = activeFileSize,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting image statistics for Veranstaltung {VeranstaltungId}", veranstaltungId);
            throw;
        }
    }

    public async Task<object> GetOverallImageStatisticsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting overall image statistics");

        try
        {
            var totalImages = await _bildRepository.CountAsync(null, false, cancellationToken);
            var activeImages = await _bildRepository.CountAsync(b => b.Aktiv == true, false, cancellationToken);

            var allImages = await _bildRepository.GetAllAsync(false, cancellationToken);
            // DateiGroesse property doesn't exist, set to 0
            var totalFileSize = 0L;
            var activeFileSize = 0L;

            return new
            {
                TotalImages = totalImages,
                ActiveImages = activeImages,
                TotalFileSize = totalFileSize,
                ActiveFileSize = activeFileSize,
                GeneratedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting overall image statistics");
            throw;
        }
    }

    public async Task<PagedResult<VeranstaltungBildDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged veranstaltung bilder, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _bildRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<VeranstaltungBildDto>
        {
            Items = _mapper.Map<IEnumerable<VeranstaltungBildDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion
}
