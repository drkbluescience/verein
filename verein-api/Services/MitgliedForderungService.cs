using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.MitgliedForderung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for MitgliedForderung business operations
/// </summary>
public class MitgliedForderungService : IMitgliedForderungService
{
    private readonly IMitgliedForderungRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedForderungService> _logger;

    public MitgliedForderungService(
        IMitgliedForderungRepository repository,
        IMapper mapper,
        ILogger<MitgliedForderungService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<MitgliedForderungDto> CreateAsync(CreateMitgliedForderungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new forderung for mitglied {MitgliedId}", createDto.MitgliedId);

        try
        {
            var forderung = _mapper.Map<MitgliedForderung>(createDto);
            forderung.Created = DateTime.UtcNow;
            forderung.CreatedBy = 1; // TODO: Get from current user context

            var created = await _repository.AddAsync(forderung, cancellationToken);
            
            _logger.LogInformation("Successfully created forderung with ID {ForderungId}", created.Id);
            
            return _mapper.Map<MitgliedForderungDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating forderung for mitglied {MitgliedId}", createDto.MitgliedId);
            throw;
        }
    }

    public async Task<MitgliedForderungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderung by ID {ForderungId}", id);

        var forderung = await _repository.GetByIdAsync(id, false, cancellationToken);
        return forderung != null ? _mapper.Map<MitgliedForderungDto>(forderung) : null;
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all forderungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var forderungen = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<MitgliedForderungDto> UpdateAsync(int id, UpdateMitgliedForderungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating forderung with ID {ForderungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Forderung with ID {id} not found");
            }

            _mapper.Map(updateDto, existing);
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully updated forderung with ID {ForderungId}", id);
            
            return _mapper.Map<MitgliedForderungDto>(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating forderung with ID {ForderungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting forderung with ID {ForderungId}", id);

        try
        {
            await _repository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted forderung with ID {ForderungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting forderung with ID {ForderungId}", id);
            throw;
        }
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<MitgliedForderungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for mitglied {MitgliedId}", mitgliedId);

        var forderungen = await _repository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for verein {VereinId}", vereinId);

        var forderungen = await _repository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetUnpaidAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting unpaid forderungen for verein {VereinId}", vereinId);

        var forderungen = await _repository.GetUnpaidAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetOverdueAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting overdue forderungen for verein {VereinId}", vereinId);

        var forderungen = await _repository.GetOverdueAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByJahrAsync(int jahr, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for jahr {Jahr}, verein {VereinId}", jahr, vereinId);

        var forderungen = await _repository.GetByJahrAsync(jahr, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByJahrMonatAsync(int jahr, int monat, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for jahr {Jahr}, monat {Monat}, verein {VereinId}", jahr, monat, vereinId);

        var forderungen = await _repository.GetByJahrMonatAsync(jahr, monat, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByDueDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen from {FromDate} to {ToDate}, verein {VereinId}", fromDate, toDate, vereinId);

        var forderungen = await _repository.GetByDueDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<MitgliedForderungDto?> GetByForderungsnummerAsync(string forderungsnummer, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderung by nummer {Forderungsnummer}", forderungsnummer);

        var forderung = await _repository.GetByForderungsnummerAsync(forderungsnummer, cancellationToken);
        return forderung != null ? _mapper.Map<MitgliedForderungDto>(forderung) : null;
    }

    public async Task<decimal> GetTotalUnpaidAmountAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total unpaid amount for mitglied {MitgliedId}", mitgliedId);

        return await _repository.GetTotalUnpaidAmountAsync(mitgliedId, cancellationToken);
    }

    public async Task<decimal> GetTotalUnpaidAmountByVereinAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total unpaid amount for verein {VereinId}", vereinId);

        return await _repository.GetTotalUnpaidAmountByVereinAsync(vereinId, cancellationToken);
    }

    #endregion
}

