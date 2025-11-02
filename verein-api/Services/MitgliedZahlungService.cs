using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.MitgliedZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for MitgliedZahlung business operations
/// </summary>
public class MitgliedZahlungService : IMitgliedZahlungService
{
    private readonly IMitgliedZahlungRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedZahlungService> _logger;

    public MitgliedZahlungService(
        IMitgliedZahlungRepository repository,
        IMapper mapper,
        ILogger<MitgliedZahlungService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<MitgliedZahlungDto> CreateAsync(CreateMitgliedZahlungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new zahlung for mitglied {MitgliedId}", createDto.MitgliedId);

        try
        {
            var zahlung = _mapper.Map<MitgliedZahlung>(createDto);
            zahlung.Created = DateTime.UtcNow;
            zahlung.CreatedBy = 1; // TODO: Get from current user context

            var created = await _repository.AddAsync(zahlung, cancellationToken);
            
            _logger.LogInformation("Successfully created zahlung with ID {ZahlungId}", created.Id);
            
            return _mapper.Map<MitgliedZahlungDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating zahlung for mitglied {MitgliedId}", createDto.MitgliedId);
            throw;
        }
    }

    public async Task<MitgliedZahlungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlung by ID {ZahlungId}", id);

        var zahlung = await _repository.GetByIdAsync(id, false, cancellationToken);
        return zahlung != null ? _mapper.Map<MitgliedZahlungDto>(zahlung) : null;
    }

    public async Task<IEnumerable<MitgliedZahlungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all zahlungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var zahlungen = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<MitgliedZahlungDto> UpdateAsync(int id, UpdateMitgliedZahlungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating zahlung with ID {ZahlungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Zahlung with ID {id} not found");
            }

            _mapper.Map(updateDto, existing);
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully updated zahlung with ID {ZahlungId}", id);
            
            return _mapper.Map<MitgliedZahlungDto>(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating zahlung with ID {ZahlungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting zahlung with ID {ZahlungId}", id);

        try
        {
            await _repository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted zahlung with ID {ZahlungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting zahlung with ID {ZahlungId}", id);
            throw;
        }
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<MitgliedZahlungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for mitglied {MitgliedId}", mitgliedId);

        var zahlungen = await _repository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<MitgliedZahlungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for verein {VereinId}", vereinId);

        var zahlungen = await _repository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<MitgliedZahlungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen from {FromDate} to {ToDate}, verein {VereinId}", fromDate, toDate, vereinId);

        var zahlungen = await _repository.GetByDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<MitgliedZahlungDto>> GetByForderungIdAsync(int forderungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for forderung {ForderungId}", forderungId);

        var zahlungen = await _repository.GetByForderungIdAsync(forderungId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<MitgliedZahlungDto>> GetByBankkontoIdAsync(int bankkontoId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for bankkonto {BankkontoId}", bankkontoId);

        var zahlungen = await _repository.GetByBankkontoIdAsync(bankkontoId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<MitgliedZahlungDto>> GetUnallocatedAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting unallocated zahlungen for verein {VereinId}", vereinId);

        var zahlungen = await _repository.GetUnallocatedAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedZahlungDto>>(zahlungen);
    }

    public async Task<decimal> GetTotalPaymentAmountAsync(int mitgliedId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total payment amount for mitglied {MitgliedId}", mitgliedId);

        return await _repository.GetTotalPaymentAmountAsync(mitgliedId, fromDate, toDate, cancellationToken);
    }

    public async Task<decimal> GetTotalPaymentAmountByVereinAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total payment amount for verein {VereinId}", vereinId);

        return await _repository.GetTotalPaymentAmountByVereinAsync(vereinId, fromDate, toDate, cancellationToken);
    }

    #endregion
}

