using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.VereinDitibZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for VereinDitibZahlung business operations
/// </summary>
public class VereinDitibZahlungService : IVereinDitibZahlungService
{
    private readonly IVereinDitibZahlungRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<VereinDitibZahlungService> _logger;

    public VereinDitibZahlungService(
        IVereinDitibZahlungRepository repository,
        IMapper mapper,
        ILogger<VereinDitibZahlungService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<VereinDitibZahlungDto> CreateAsync(CreateVereinDitibZahlungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new DITIB zahlung for verein {VereinId}", createDto.VereinId);

        try
        {
            var zahlung = _mapper.Map<VereinDitibZahlung>(createDto);
            zahlung.Created = DateTime.UtcNow;
            zahlung.CreatedBy = 1; // TODO: Get from current user context

            var created = await _repository.AddAsync(zahlung, cancellationToken);
            
            _logger.LogInformation("Successfully created DITIB zahlung with ID {ZahlungId}", created.Id);
            
            return _mapper.Map<VereinDitibZahlungDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating DITIB zahlung for verein {VereinId}", createDto.VereinId);
            throw;
        }
    }

    public async Task<VereinDitibZahlungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting DITIB zahlung by ID {ZahlungId}", id);

        var zahlung = await _repository.GetByIdAsync(id, false, cancellationToken);
        return zahlung != null ? _mapper.Map<VereinDitibZahlungDto>(zahlung) : null;
    }

    public async Task<IEnumerable<VereinDitibZahlungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all DITIB zahlungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var zahlungen = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDitibZahlungDto>>(zahlungen);
    }

    public async Task<VereinDitibZahlungDto> UpdateAsync(int id, UpdateVereinDitibZahlungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating DITIB zahlung with ID {ZahlungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                throw new KeyNotFoundException($"DITIB Zahlung with ID {id} not found");
            }

            _mapper.Map(updateDto, existing);
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully updated DITIB zahlung with ID {ZahlungId}", id);
            
            return _mapper.Map<VereinDitibZahlungDto>(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating DITIB zahlung with ID {ZahlungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting DITIB zahlung with ID {ZahlungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                _logger.LogWarning("DITIB Zahlung with ID {ZahlungId} not found for deletion", id);
                return false;
            }

            existing.DeletedFlag = true;
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully soft deleted DITIB zahlung with ID {ZahlungId}", id);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting DITIB zahlung with ID {ZahlungId}", id);
            throw;
        }
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<VereinDitibZahlungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting DITIB zahlungen for verein {VereinId}", vereinId);

        var zahlungen = await _repository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDitibZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<VereinDitibZahlungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting DITIB zahlungen by date range from {FromDate} to {ToDate}", fromDate, toDate);

        var zahlungen = await _repository.GetByDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDitibZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<VereinDitibZahlungDto>> GetByZahlungsperiodeAsync(string zahlungsperiode, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting DITIB zahlungen for period {Zahlungsperiode}", zahlungsperiode);

        var zahlungen = await _repository.GetByZahlungsperiodeAsync(zahlungsperiode, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDitibZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<VereinDitibZahlungDto>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting DITIB zahlungen by status {StatusId}", statusId);

        var zahlungen = await _repository.GetByStatusAsync(statusId, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDitibZahlungDto>>(zahlungen);
    }

    public async Task<decimal> GetTotalPaymentAmountAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total DITIB payment amount for verein {VereinId}", vereinId);

        return await _repository.GetTotalPaymentAmountAsync(vereinId, fromDate, toDate, cancellationToken);
    }

    public async Task<IEnumerable<VereinDitibZahlungDto>> GetPendingAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting pending DITIB zahlungen for verein {VereinId}", vereinId);

        var zahlungen = await _repository.GetPendingAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<VereinDitibZahlungDto>>(zahlungen);
    }

    #endregion
}

