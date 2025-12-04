using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.VeranstaltungZahlung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for VeranstaltungZahlung business operations
/// </summary>
public class VeranstaltungZahlungService : IVeranstaltungZahlungService
{
    private readonly IVeranstaltungZahlungRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<VeranstaltungZahlungService> _logger;

    public VeranstaltungZahlungService(
        IVeranstaltungZahlungRepository repository,
        IMapper mapper,
        ILogger<VeranstaltungZahlungService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<VeranstaltungZahlungDto> CreateAsync(CreateVeranstaltungZahlungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new veranstaltung zahlung for veranstaltung {VeranstaltungId}", createDto.VeranstaltungId);

        try
        {
            var zahlung = _mapper.Map<VeranstaltungZahlung>(createDto);
            zahlung.Created = DateTime.UtcNow;
            zahlung.CreatedBy = 1; // TODO: Get from current user context

            var created = await _repository.AddAsync(zahlung, cancellationToken);
            
            _logger.LogInformation("Successfully created veranstaltung zahlung with ID {ZahlungId}", created.Id);
            
            return _mapper.Map<VeranstaltungZahlungDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating veranstaltung zahlung for veranstaltung {VeranstaltungId}", createDto.VeranstaltungId);
            throw;
        }
    }

    public async Task<VeranstaltungZahlungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting veranstaltung zahlung by ID {ZahlungId}", id);

        var zahlung = await _repository.GetByIdAsync(id, false, cancellationToken);
        return zahlung != null ? _mapper.Map<VeranstaltungZahlungDto>(zahlung) : null;
    }

    public async Task<IEnumerable<VeranstaltungZahlungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all veranstaltung zahlungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var zahlungen = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungZahlungDto>>(zahlungen);
    }

    public async Task<VeranstaltungZahlungDto> UpdateAsync(int id, UpdateVeranstaltungZahlungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating veranstaltung zahlung with ID {ZahlungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Veranstaltung zahlung with ID {id} not found");
            }

            _mapper.Map(updateDto, existing);
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully updated veranstaltung zahlung with ID {ZahlungId}", id);
            
            return _mapper.Map<VeranstaltungZahlungDto>(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating veranstaltung zahlung with ID {ZahlungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting veranstaltung zahlung with ID {ZahlungId}", id);

        try
        {
            await _repository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted veranstaltung zahlung with ID {ZahlungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting veranstaltung zahlung with ID {ZahlungId}", id);
            throw;
        }
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<VeranstaltungZahlungDto>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for veranstaltung {VeranstaltungId}", veranstaltungId);

        var zahlungen = await _repository.GetByVeranstaltungIdAsync(veranstaltungId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<VeranstaltungZahlungDto>> GetByAnmeldungIdAsync(int anmeldungId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for anmeldung {AnmeldungId}", anmeldungId);

        var zahlungen = await _repository.GetByAnmeldungIdAsync(anmeldungId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungZahlungDto>>(zahlungen);
    }

    public async Task<IEnumerable<VeranstaltungZahlungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen from {FromDate} to {ToDate}, veranstaltung {VeranstaltungId}", fromDate, toDate, veranstaltungId);

        var zahlungen = await _repository.GetByDateRangeAsync(fromDate, toDate, veranstaltungId, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungZahlungDto>>(zahlungen);
    }

    public async Task<decimal> GetTotalPaymentAmountAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total payment amount for veranstaltung {VeranstaltungId}", veranstaltungId);

        return await _repository.GetTotalPaymentAmountAsync(veranstaltungId, cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungZahlungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting zahlungen for mitglied {MitgliedId}", mitgliedId);

        var zahlungen = await _repository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<VeranstaltungZahlungDto>>(zahlungen);
    }

    #endregion
}

