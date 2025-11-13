using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Interfaces;
using VereinsApi.Domain.Entities;
using VereinsApi.DTOs.RechtlicheDaten;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for RechtlicheDaten business operations
/// </summary>
public class RechtlicheDatenService : IRechtlicheDatenService
{
    private readonly IRepository<RechtlicheDaten> _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<RechtlicheDatenService> _logger;

    public RechtlicheDatenService(
        IRepository<RechtlicheDaten> repository,
        IMapper mapper,
        ILogger<RechtlicheDatenService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<RechtlicheDatenDto> CreateAsync(CreateRechtlicheDatenDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating RechtlicheDaten for VereinId {VereinId}", createDto.VereinId);

        try
        {
            // Check if RechtlicheDaten already exists for this Verein
            var existing = await _repository.GetFirstOrDefaultAsync(
                r => r.VereinId == createDto.VereinId, 
                false, 
                cancellationToken);

            if (existing != null)
            {
                throw new ArgumentException($"RechtlicheDaten already exists for VereinId {createDto.VereinId}");
            }

            var entity = _mapper.Map<RechtlicheDaten>(createDto);
            var created = await _repository.AddAsync(entity, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created RechtlicheDaten with ID {Id}", created.Id);
            return _mapper.Map<RechtlicheDatenDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating RechtlicheDaten for VereinId {VereinId}", createDto.VereinId);
            throw;
        }
    }

    public async Task<RechtlicheDatenDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting RechtlicheDaten by ID {Id}", id);

        var entity = await _repository.GetByIdAsync(id, false, cancellationToken);
        return entity != null ? _mapper.Map<RechtlicheDatenDto>(entity) : null;
    }

    public async Task<RechtlicheDatenDto?> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting RechtlicheDaten by VereinId {VereinId}", vereinId);

        var entity = await _repository.GetFirstOrDefaultAsync(
            r => r.VereinId == vereinId, 
            false, 
            cancellationToken);

        return entity != null ? _mapper.Map<RechtlicheDatenDto>(entity) : null;
    }

    public async Task<RechtlicheDatenDto> UpdateAsync(int id, UpdateRechtlicheDatenDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating RechtlicheDaten with ID {Id}", id);

        try
        {
            var entity = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (entity == null)
            {
                throw new KeyNotFoundException($"RechtlicheDaten with ID {id} not found");
            }

            // Manually update only non-null properties to preserve existing data
            // Court Registration
            if (updateDto.RegistergerichtName != null)
                entity.RegistergerichtName = updateDto.RegistergerichtName;
            if (updateDto.RegistergerichtNummer != null)
                entity.RegistergerichtNummer = updateDto.RegistergerichtNummer;
            if (updateDto.RegistergerichtOrt != null)
                entity.RegistergerichtOrt = updateDto.RegistergerichtOrt;
            if (updateDto.RegistergerichtEintragungsdatum.HasValue)
                entity.RegistergerichtEintragungsdatum = updateDto.RegistergerichtEintragungsdatum;

            // Tax Office
            if (updateDto.FinanzamtName != null)
                entity.FinanzamtName = updateDto.FinanzamtName;
            if (updateDto.FinanzamtNummer != null)
                entity.FinanzamtNummer = updateDto.FinanzamtNummer;
            if (updateDto.FinanzamtOrt != null)
                entity.FinanzamtOrt = updateDto.FinanzamtOrt;

            // Tax Status
            if (updateDto.Steuerpflichtig.HasValue)
                entity.Steuerpflichtig = updateDto.Steuerpflichtig;
            if (updateDto.Steuerbefreit.HasValue)
                entity.Steuerbefreit = updateDto.Steuerbefreit;
            if (updateDto.GemeinnuetzigAnerkannt.HasValue)
                entity.GemeinnuetzigAnerkannt = updateDto.GemeinnuetzigAnerkannt;
            if (updateDto.GemeinnuetzigkeitBis.HasValue)
                entity.GemeinnuetzigkeitBis = updateDto.GemeinnuetzigkeitBis;

            // Document Paths
            if (updateDto.SteuererklaerungPfad != null)
                entity.SteuererklaerungPfad = updateDto.SteuererklaerungPfad;
            if (updateDto.SteuererklaerungJahr.HasValue)
                entity.SteuererklaerungJahr = updateDto.SteuererklaerungJahr;
            if (updateDto.SteuerbefreiungPfad != null)
                entity.SteuerbefreiungPfad = updateDto.SteuerbefreiungPfad;
            if (updateDto.GemeinnuetzigkeitsbescheidPfad != null)
                entity.GemeinnuetzigkeitsbescheidPfad = updateDto.GemeinnuetzigkeitsbescheidPfad;
            if (updateDto.RegisterauszugPfad != null)
                entity.RegisterauszugPfad = updateDto.RegisterauszugPfad;

            // Notes
            if (updateDto.Bemerkung != null)
                entity.Bemerkung = updateDto.Bemerkung;

            // Update metadata
            entity.Modified = DateTime.UtcNow;

            await _repository.UpdateAsync(entity, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated RechtlicheDaten with ID {Id}", id);
            return _mapper.Map<RechtlicheDatenDto>(entity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating RechtlicheDaten with ID {Id}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting RechtlicheDaten with ID {Id}", id);

        try
        {
            await _repository.DeleteAsync(id, cancellationToken);
            await _repository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully deleted RechtlicheDaten with ID {Id}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting RechtlicheDaten with ID {Id}", id);
            throw;
        }
    }

    public async Task<IEnumerable<RechtlicheDatenDto>> GetExpiringGemeinnuetzigkeitAsync(
        int daysThreshold = 30, 
        CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting RechtlicheDaten with expiring Gemeinnützigkeit (threshold: {Days} days)", daysThreshold);

        var thresholdDate = DateTime.Now.AddDays(daysThreshold);

        var entities = await _repository.GetAsync(
            r => r.GemeinnuetzigAnerkannt == true && 
                 r.GemeinnuetzigkeitBis.HasValue && 
                 r.GemeinnuetzigkeitBis.Value <= thresholdDate,
            false,
            cancellationToken);

        return _mapper.Map<IEnumerable<RechtlicheDatenDto>>(entities);
    }
}

