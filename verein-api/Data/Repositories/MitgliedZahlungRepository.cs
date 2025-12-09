using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for MitgliedZahlung entity
/// </summary>
public class MitgliedZahlungRepository : Repository<MitgliedZahlung>, IMitgliedZahlungRepository
{
    public MitgliedZahlungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(z => z.MitgliedId == mitgliedId)
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetByMitgliedIdPaginatedAsync(
        int mitgliedId,
        int page,
        int pageSize,
        bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Calculate skip count
        int skipCount = (page - 1) * pageSize;

        return await query
            .Where(z => z.MitgliedId == mitgliedId)
            .OrderByDescending(z => z.Zahlungsdatum)
            .Skip(skipCount)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(z => z.MitgliedId == mitgliedId)
            .CountAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(z => z.VereinId == vereinId)
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet;

        query = query.Where(z => z.Zahlungsdatum >= fromDate && z.Zahlungsdatum <= toDate);

        if (vereinId.HasValue)
        {
            query = query.Where(z => z.VereinId == vereinId.Value);
        }

        return await query
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetByForderungIdAsync(int forderungId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(z => z.ForderungId == forderungId)
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetByBankkontoIdAsync(int bankkontoId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(z => z.BankkontoId == bankkontoId)
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedZahlung>> GetUnallocatedAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet;

        query = query.Where(z => z.ForderungId == null);

        if (vereinId.HasValue)
        {
            query = query.Where(z => z.VereinId == vereinId.Value);
        }

        return await query
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<MitgliedZahlung?> GetWithRelatedDataAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(z => z.Forderung)
            .Include(z => z.Bankkonto)
            .Include(z => z.BankBuchung)
            .Include(z => z.ForderungZahlungen)
                .ThenInclude(fz => fz.Forderung)
            .Include(z => z.Vorauszahlungen)
            .FirstOrDefaultAsync(z => z.Id == id, cancellationToken);
    }

    public async Task<decimal> GetTotalPaymentAmountAsync(int mitgliedId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet.Where(z => z.MitgliedId == mitgliedId);

        if (fromDate.HasValue)
        {
            query = query.Where(z => z.Zahlungsdatum >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(z => z.Zahlungsdatum <= toDate.Value);
        }

        var total = await query.SumAsync(z => (decimal?)z.Betrag, cancellationToken);
        return total ?? 0;
    }

    public async Task<decimal> GetTotalPaymentAmountByVereinAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedZahlung> query = _dbSet.Where(z => z.VereinId == vereinId);

        if (fromDate.HasValue)
        {
            query = query.Where(z => z.Zahlungsdatum >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(z => z.Zahlungsdatum <= toDate.Value);
        }

        var total = await query.SumAsync(z => (decimal?)z.Betrag, cancellationToken);
        return total ?? 0;
    }
}

