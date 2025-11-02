using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.BankBuchung;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for BankBuchung business operations
/// </summary>
public class BankBuchungService : IBankBuchungService
{
    private readonly IBankBuchungRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<BankBuchungService> _logger;

    public BankBuchungService(
        IBankBuchungRepository repository,
        IMapper mapper,
        ILogger<BankBuchungService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<BankBuchungDto> CreateAsync(CreateBankBuchungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new bank buchung for verein {VereinId}", createDto.VereinId);

        try
        {
            var buchung = _mapper.Map<BankBuchung>(createDto);
            buchung.Created = DateTime.UtcNow;
            buchung.CreatedBy = 1; // TODO: Get from current user context

            var created = await _repository.AddAsync(buchung, cancellationToken);
            
            _logger.LogInformation("Successfully created bank buchung with ID {BuchungId}", created.Id);
            
            return _mapper.Map<BankBuchungDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bank buchung for verein {VereinId}", createDto.VereinId);
            throw;
        }
    }

    public async Task<BankBuchungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bank buchung by ID {BuchungId}", id);

        var buchung = await _repository.GetByIdAsync(id, false, cancellationToken);
        return buchung != null ? _mapper.Map<BankBuchungDto>(buchung) : null;
    }

    public async Task<IEnumerable<BankBuchungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all bank buchungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var buchungen = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<BankBuchungDto>>(buchungen);
    }

    public async Task<BankBuchungDto> UpdateAsync(int id, UpdateBankBuchungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating bank buchung with ID {BuchungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Bank buchung with ID {id} not found");
            }

            _mapper.Map(updateDto, existing);
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully updated bank buchung with ID {BuchungId}", id);
            
            return _mapper.Map<BankBuchungDto>(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating bank buchung with ID {BuchungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting bank buchung with ID {BuchungId}", id);

        try
        {
            await _repository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted bank buchung with ID {BuchungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bank buchung with ID {BuchungId}", id);
            throw;
        }
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<BankBuchungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bank buchungen for verein {VereinId}", vereinId);

        var buchungen = await _repository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<BankBuchungDto>>(buchungen);
    }

    public async Task<IEnumerable<BankBuchungDto>> GetByBankKontoIdAsync(int bankKontoId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bank buchungen for bankkonto {BankKontoId}", bankKontoId);

        var buchungen = await _repository.GetByBankKontoIdAsync(bankKontoId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<BankBuchungDto>>(buchungen);
    }

    public async Task<IEnumerable<BankBuchungDto>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? bankKontoId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bank buchungen from {FromDate} to {ToDate}, bankkonto {BankKontoId}", fromDate, toDate, bankKontoId);

        var buchungen = await _repository.GetByDateRangeAsync(fromDate, toDate, bankKontoId, cancellationToken);
        return _mapper.Map<IEnumerable<BankBuchungDto>>(buchungen);
    }

    public async Task<IEnumerable<BankBuchungDto>> GetUnmatchedAsync(int? bankKontoId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting unmatched bank buchungen for bankkonto {BankKontoId}", bankKontoId);

        var buchungen = await _repository.GetUnmatchedAsync(bankKontoId, cancellationToken);
        return _mapper.Map<IEnumerable<BankBuchungDto>>(buchungen);
    }

    public async Task<decimal> GetTotalAmountAsync(int bankKontoId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total amount for bankkonto {BankKontoId}", bankKontoId);

        return await _repository.GetTotalAmountAsync(bankKontoId, fromDate, toDate, cancellationToken);
    }

    #endregion
}

