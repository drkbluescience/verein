using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for VereinDitibZahlung entity
/// </summary>
public class VereinDitibZahlungRepository : Repository<VereinDitibZahlung>, IVereinDitibZahlungRepository
{
    public VereinDitibZahlungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<VereinDitibZahlung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VereinDitibZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(z => z.VereinId == vereinId)
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VereinDitibZahlung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VereinDitibZahlung> query = _dbSet;

        query = query.Where(z => z.Zahlungsdatum >= fromDate && z.Zahlungsdatum <= toDate);

        if (vereinId.HasValue)
        {
            query = query.Where(z => z.VereinId == vereinId.Value);
        }

        return await query
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VereinDitibZahlung>> GetByZahlungsperiodeAsync(string zahlungsperiode, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VereinDitibZahlung> query = _dbSet;

        query = query.Where(z => z.Zahlungsperiode == zahlungsperiode);

        if (vereinId.HasValue)
        {
            query = query.Where(z => z.VereinId == vereinId.Value);
        }

        return await query
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VereinDitibZahlung>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VereinDitibZahlung> query = _dbSet;

        query = query.Where(z => z.StatusId == statusId);

        if (vereinId.HasValue)
        {
            query = query.Where(z => z.VereinId == vereinId.Value);
        }

        return await query
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetTotalPaymentAmountAsync(int vereinId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VereinDitibZahlung> query = _dbSet;

        query = query.Where(z => z.VereinId == vereinId);

        if (fromDate.HasValue)
        {
            query = query.Where(z => z.Zahlungsdatum >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(z => z.Zahlungsdatum <= toDate.Value);
        }

        return await query.SumAsync(z => z.Betrag, cancellationToken);
    }

    public async Task<IEnumerable<VereinDitibZahlung>> GetPendingAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VereinDitibZahlung> query = _dbSet;

        // StatusId 2 = OFFEN (Open/Pending)
        query = query.Where(z => z.StatusId == 2);

        if (vereinId.HasValue)
        {
            query = query.Where(z => z.VereinId == vereinId.Value);
        }

        return await query
            .OrderByDescending(z => z.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }
}

