using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Bankkonto entity with specific operations
/// </summary>
public class BankkontoRepository : Repository<Bankkonto>, IBankkontoRepository
{
    public BankkontoRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Bankkonto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.VereinId == vereinId)
            .OrderBy(b => b.IstStandard == true ? 0 : 1)
            .ThenBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> GetByAccountTypeIdAsync(int accountTypeId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.KontotypId == accountTypeId)
            .OrderBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<Bankkonto?> GetByIBANAsync(string iban, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var normalizedIban = iban.Replace(" ", "").ToUpperInvariant();
        return await query
            .FirstOrDefaultAsync(b => b.IBAN.Replace(" ", "").ToUpper() == normalizedIban, cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> GetByBankNameAsync(string bankName, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.Bankname != null && b.Bankname.ToLower().Contains(bankName.ToLower()))
            .OrderBy(b => b.Bankname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> GetDefaultBankAccountsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.IstStandard == true)
            .OrderBy(b => b.VereinId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> GetValidBankAccountsForDateAsync(DateTime date, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => (b.GueltigVon == null || b.GueltigVon <= date) &&
                       (b.GueltigBis == null || b.GueltigBis >= date))
            .OrderBy(b => b.VereinId)
            .ThenBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> SearchBankAccountsAsync(string searchTerm, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var lowerSearchTerm = searchTerm.ToLower();
        return await query
            .Where(b => 
                (b.IBAN != null && b.IBAN.ToLower().Contains(lowerSearchTerm)) ||
                (b.Bankname != null && b.Bankname.ToLower().Contains(lowerSearchTerm)) ||
                (b.Kontoinhaber != null && b.Kontoinhaber.ToLower().Contains(lowerSearchTerm)) ||
                (b.KontoNr != null && b.KontoNr.Contains(searchTerm)))
            .OrderBy(b => b.Bankname)
            .ThenBy(b => b.IBAN)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IBANExistsAsync(string iban, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        var normalizedIban = iban.Replace(" ", "").ToUpperInvariant();
        IQueryable<Bankkonto> query = _dbSet;
        query = query.Where(b => b.IBAN.Replace(" ", "").ToUpper() == normalizedIban);

        if (excludeId.HasValue)
        {
            query = query.Where(b => b.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> DefaultBankAccountExistsForVereinAsync(int vereinId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;
        query = query.Where(b => b.VereinId == vereinId && b.IstStandard == true);

        if (excludeId.HasValue)
        {
            query = query.Where(b => b.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> GetByBICAsync(string bic, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.BIC == bic)
            .OrderBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> GetByAccountNumberAsync(string accountNumber, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.KontoNr == accountNumber)
            .OrderBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Bankkonto>> SearchBankAccountsAsync(string searchTerm, int? vereinId = null, int? accountTypeId = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Bankkonto> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (vereinId.HasValue)
        {
            query = query.Where(b => b.VereinId == vereinId.Value);
        }

        if (accountTypeId.HasValue)
        {
            query = query.Where(b => b.KontotypId == accountTypeId.Value);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(b =>
                (b.IBAN != null && b.IBAN.ToLower().Contains(lowerSearchTerm)) ||
                (b.Bankname != null && b.Bankname.ToLower().Contains(lowerSearchTerm)) ||
                (b.Kontoinhaber != null && b.Kontoinhaber.ToLower().Contains(lowerSearchTerm)) ||
                (b.KontoNr != null && b.KontoNr.Contains(searchTerm)));
        }

        return await query
            .OrderBy(b => b.Bankname)
            .ThenBy(b => b.IBAN)
            .ToListAsync(cancellationToken);
    }
}
