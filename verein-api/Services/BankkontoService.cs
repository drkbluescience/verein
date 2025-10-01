using AutoMapper;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.Bankkonto;
using VereinsApi.Services.Interfaces;
using VereinsApi.Common.Models;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for Bankkonto business operations
/// </summary>
public class BankkontoService : IBankkontoService
{
    private readonly IRepository<Bankkonto> _bankkontoRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<BankkontoService> _logger;

    public BankkontoService(
        IRepository<Bankkonto> bankkontoRepository,
        IMapper mapper,
        ILogger<BankkontoService> logger)
    {
        _bankkontoRepository = bankkontoRepository;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<BankkontoDto> CreateAsync(CreateBankkontoDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new bankkonto for Verein {VereinId} with IBAN {IBAN}", createDto.VereinId, createDto.IBAN);

        try
        {
            // Validate business rules
            await ValidateCreateAsync(createDto, cancellationToken);

            var bankkonto = _mapper.Map<Bankkonto>(createDto);
            
            var createdBankkonto = await _bankkontoRepository.AddAsync(bankkonto, cancellationToken);
            await _bankkontoRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created bankkonto with ID {BankkontoId}", createdBankkonto.Id);
            return _mapper.Map<BankkontoDto>(createdBankkonto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bankkonto for Verein {VereinId}", createDto.VereinId);
            throw;
        }
    }

    public async Task<BankkontoDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bankkonto by ID {BankkontoId}", id);

        var bankkonto = await _bankkontoRepository.GetByIdAsync(id, false, cancellationToken);
        return bankkonto != null ? _mapper.Map<BankkontoDto>(bankkonto) : null;
    }

    public async Task<IEnumerable<BankkontoDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all bankkonten, includeDeleted: {IncludeDeleted}", includeDeleted);

        var bankkonten = await _bankkontoRepository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<BankkontoDto>>(bankkonten);
    }

    public async Task<BankkontoDto> UpdateAsync(int id, UpdateBankkontoDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating bankkonto {BankkontoId}", id);

        try
        {
            var existingBankkonto = await _bankkontoRepository.GetByIdAsync(id, false, cancellationToken);
            if (existingBankkonto == null)
            {
                throw new ArgumentException($"Bankkonto with ID {id} not found");
            }

            // Validate business rules
            await ValidateUpdateAsync(id, updateDto, cancellationToken);

            _mapper.Map(updateDto, existingBankkonto);
            
            var updatedBankkonto = await _bankkontoRepository.UpdateAsync(existingBankkonto, cancellationToken);
            await _bankkontoRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated bankkonto {BankkontoId}", id);
            return _mapper.Map<BankkontoDto>(updatedBankkonto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating bankkonto {BankkontoId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Soft deleting bankkonto {BankkontoId}", id);

        try
        {
            var bankkonto = await _bankkontoRepository.GetByIdAsync(id, false, cancellationToken);
            if (bankkonto == null)
            {
                _logger.LogWarning("Bankkonto {BankkontoId} not found for deletion", id);
                return false;
            }

            await _bankkontoRepository.DeleteAsync(bankkonto, cancellationToken);
            await _bankkontoRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft deleted bankkonto {BankkontoId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bankkonto {BankkontoId}", id);
            throw;
        }
    }

    public async Task<bool> HardDeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("Hard deleting bankkonto {BankkontoId}", id);

        try
        {
            await _bankkontoRepository.HardDeleteAsync(id, cancellationToken);
            await _bankkontoRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully hard deleted bankkonto {BankkontoId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error hard deleting bankkonto {BankkontoId}", id);
            throw;
        }
    }

    #endregion

    #region Query Operations

    public async Task<IEnumerable<BankkontoDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bankkonten for Verein {VereinId}", vereinId);

        var bankkonten = await _bankkontoRepository.GetAsync(b => b.VereinId == vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<BankkontoDto>>(bankkonten);
    }

    public async Task<BankkontoDto?> GetByIbanAsync(string iban, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bankkonto by IBAN {IBAN}", iban);

        var bankkonto = await _bankkontoRepository.GetFirstOrDefaultAsync(b => b.IBAN == iban, false, cancellationToken);
        return bankkonto != null ? _mapper.Map<BankkontoDto>(bankkonto) : null;
    }

    public async Task<IEnumerable<BankkontoDto>> GetByBankNameAsync(string bankName, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bankkonten by bank name {BankName}", bankName);

        var bankkonten = await _bankkontoRepository.GetAsync(b => b.Bankname == bankName, false, cancellationToken);
        return _mapper.Map<IEnumerable<BankkontoDto>>(bankkonten);
    }

    public async Task<IEnumerable<BankkontoDto>> GetValidAtDateAsync(DateTime date, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bankkonten valid at date {Date}", date);

        var bankkonten = await _bankkontoRepository.GetAsync(b => 
            (b.GueltigVon == null || b.GueltigVon <= date) &&
            (b.GueltigBis == null || b.GueltigBis >= date) &&
            (vereinId == null || b.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<BankkontoDto>>(bankkonten);
    }

    public async Task<IEnumerable<BankkontoDto>> GetActiveAccountsAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting active bankkonten");

        var bankkonten = await _bankkontoRepository.GetAsync(b => 
            b.Aktiv == true &&
            (vereinId == null || b.VereinId == vereinId), 
            false, cancellationToken);

        return _mapper.Map<IEnumerable<BankkontoDto>>(bankkonten);
    }

    public async Task<BankkontoDto?> GetStandardAccountAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting standard bank account for Verein {VereinId}", vereinId);

        var bankkonto = await _bankkontoRepository.GetFirstOrDefaultAsync(b => 
            b.VereinId == vereinId && b.IstStandard == true, 
            false, cancellationToken);

        return bankkonto != null ? _mapper.Map<BankkontoDto>(bankkonto) : null;
    }

    #endregion

    #region Business Operations

    public async Task<bool> SetAsStandardAccountAsync(int vereinId, int accountId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Setting bank account {AccountId} as standard for Verein {VereinId}", accountId, vereinId);

        try
        {
            // First, unset all standard accounts for this verein
            var existingStandardAccounts = await _bankkontoRepository.GetAsync(b => 
                b.VereinId == vereinId && b.IstStandard == true, 
                false, cancellationToken);

            foreach (var account in existingStandardAccounts)
            {
                account.IstStandard = false;
                await _bankkontoRepository.UpdateAsync(account, cancellationToken);
            }

            // Then set the specified account as standard
            var targetAccount = await _bankkontoRepository.GetByIdAsync(accountId, false, cancellationToken);
            if (targetAccount == null || targetAccount.VereinId != vereinId)
            {
                throw new ArgumentException($"Bank account {accountId} not found or does not belong to Verein {vereinId}");
            }

            targetAccount.IstStandard = true;
            await _bankkontoRepository.UpdateAsync(targetAccount, cancellationToken);
            await _bankkontoRepository.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully set bank account {AccountId} as standard for Verein {VereinId}", accountId, vereinId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting bank account {AccountId} as standard for Verein {VereinId}", accountId, vereinId);
            throw;
        }
    }

    public bool IsValidIban(string iban)
    {
        if (string.IsNullOrWhiteSpace(iban))
            return false;

        // Remove spaces and convert to uppercase
        iban = iban.Replace(" ", "").ToUpper();

        // Check length (15-34 characters)
        if (iban.Length < 15 || iban.Length > 34)
            return false;

        // Check format (2 letters + 2 digits + alphanumeric)
        if (!Regex.IsMatch(iban, @"^[A-Z]{2}[0-9]{2}[A-Z0-9]+$"))
            return false;

        // Move first 4 characters to end
        var rearranged = iban.Substring(4) + iban.Substring(0, 4);

        // Replace letters with numbers (A=10, B=11, ..., Z=35)
        var numericString = "";
        foreach (char c in rearranged)
        {
            if (char.IsLetter(c))
            {
                numericString += (c - 'A' + 10).ToString();
            }
            else
            {
                numericString += c;
            }
        }

        // Calculate mod 97
        try
        {
            var remainder = 0;
            foreach (char digit in numericString)
            {
                remainder = (remainder * 10 + (digit - '0')) % 97;
            }
            return remainder == 1;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> IsIbanUniqueAsync(string iban, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking IBAN uniqueness for {IBAN}", iban);

        var existingAccount = await _bankkontoRepository.GetFirstOrDefaultAsync(b => 
            b.IBAN == iban && 
            (excludeId == null || b.Id != excludeId), 
            true, cancellationToken);

        return existingAccount == null;
    }

    public async Task<bool> HasAccountsAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking if Verein {VereinId} has bank accounts", vereinId);

        return await _bankkontoRepository.ExistsAsync(b => b.VereinId == vereinId, false, cancellationToken);
    }

    public async Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting bank account count for Verein {VereinId}, activeOnly: {ActiveOnly}", vereinId, activeOnly);

        return await _bankkontoRepository.CountAsync(b => 
            b.VereinId == vereinId && 
            (!activeOnly || b.Aktiv == true), 
            false, cancellationToken);
    }

    #endregion

    #region Pagination

    public async Task<PagedResult<BankkontoDto>> GetPagedAsync(int pageNumber = 1, int pageSize = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting paged bankkonten, page: {PageNumber}, size: {PageSize}", pageNumber, pageSize);

        var pagedResult = await _bankkontoRepository.GetPagedAsync(pageNumber, pageSize, includeDeleted, cancellationToken);
        
        return new PagedResult<BankkontoDto>
        {
            Items = _mapper.Map<IEnumerable<BankkontoDto>>(pagedResult.Items),
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };
    }

    #endregion

    #region Private Methods

    private async Task ValidateCreateAsync(CreateBankkontoDto createDto, CancellationToken cancellationToken)
    {
        // Validate IBAN format
        if (!IsValidIban(createDto.IBAN))
        {
            throw new ArgumentException("Invalid IBAN format");
        }

        // Check IBAN uniqueness
        if (!await IsIbanUniqueAsync(createDto.IBAN, null, cancellationToken))
        {
            throw new ArgumentException($"IBAN {createDto.IBAN} already exists");
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(createDto.Bankname))
        {
            throw new ArgumentException("Bank name is required");
        }
    }

    private async Task ValidateUpdateAsync(int id, UpdateBankkontoDto updateDto, CancellationToken cancellationToken)
    {
        // Validate IBAN format
        if (!IsValidIban(updateDto.IBAN))
        {
            throw new ArgumentException("Invalid IBAN format");
        }

        // Check IBAN uniqueness (excluding current record)
        if (!await IsIbanUniqueAsync(updateDto.IBAN, id, cancellationToken))
        {
            throw new ArgumentException($"IBAN {updateDto.IBAN} already exists");
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(updateDto.Bankname))
        {
            throw new ArgumentException("Bank name is required");
        }
    }

    #endregion
}
