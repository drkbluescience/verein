using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for MitgliedForderung entity
/// </summary>
public class MitgliedForderungRepository : Repository<MitgliedForderung>, IMitgliedForderungRepository
{
    public MitgliedForderungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MitgliedForderung>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedForderung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(f => f.MitgliedId == mitgliedId)
            .OrderByDescending(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedForderung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedForderung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(f => f.VereinId == vereinId)
            .OrderByDescending(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedForderung>> GetUnpaidAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedForderung> query = _dbSet;

        query = query.Where(f => f.BezahltAm == null);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedForderung>> GetOverdueAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        var today = DateTime.Today;
        IQueryable<MitgliedForderung> query = _dbSet;

        query = query.Where(f => f.BezahltAm == null && f.Faelligkeit < today);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedForderung>> GetByJahrAsync(int jahr, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedForderung> query = _dbSet;

        query = query.Where(f => f.Jahr == jahr);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(f => f.Monat)
            .ThenBy(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedForderung>> GetByJahrMonatAsync(int jahr, int monat, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedForderung> query = _dbSet;

        query = query.Where(f => f.Jahr == jahr && f.Monat == monat);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedForderung>> GetByDueDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedForderung> query = _dbSet;

        query = query.Where(f => f.Faelligkeit >= fromDate && f.Faelligkeit <= toDate);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(f => f.Faelligkeit)
            .ToListAsync(cancellationToken);
    }

    public async Task<MitgliedForderung?> GetByForderungsnummerAsync(string forderungsnummer, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(f => f.Forderungsnummer == forderungsnummer, cancellationToken);
    }

    public async Task<MitgliedForderung?> GetWithPaymentsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(f => f.MitgliedZahlungen)
            .Include(f => f.ForderungZahlungen)
                .ThenInclude(fz => fz.Zahlung)
            .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
    }

    public async Task<decimal> GetTotalUnpaidAmountAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.MitgliedId == mitgliedId && f.BezahltAm == null)
            .SumAsync(f => f.Betrag, cancellationToken);
    }

    public async Task<decimal> GetTotalUnpaidAmountByVereinAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.VereinId == vereinId && f.BezahltAm == null)
            .SumAsync(f => f.Betrag, cancellationToken);
    }
}

