using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for BankBuchung entity
/// </summary>
public class BankBuchungRepository : Repository<BankBuchung>, IBankBuchungRepository
{
    public BankBuchungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<BankBuchung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<BankBuchung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.VereinId == vereinId)
            .OrderByDescending(b => b.Buchungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<BankBuchung>> GetByBankKontoIdAsync(int bankKontoId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<BankBuchung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.BankKontoId == bankKontoId)
            .OrderByDescending(b => b.Buchungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<BankBuchung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? bankKontoId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<BankBuchung> query = _dbSet;

        query = query.Where(b => b.Buchungsdatum >= fromDate && b.Buchungsdatum <= toDate);

        if (bankKontoId.HasValue)
        {
            query = query.Where(b => b.BankKontoId == bankKontoId.Value);
        }

        return await query
            .OrderByDescending(b => b.Buchungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<BankBuchung>> GetUnmatchedAsync(int? bankKontoId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<BankBuchung> query = _dbSet;

        // Unmatched means no MitgliedZahlungen linked to this BankBuchung
        query = query.Where(b => !b.MitgliedZahlungen.Any());

        if (bankKontoId.HasValue)
        {
            query = query.Where(b => b.BankKontoId == bankKontoId.Value);
        }

        return await query
            .OrderByDescending(b => b.Buchungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<BankBuchung?> GetWithPaymentsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(b => b.MitgliedZahlungen)
                .ThenInclude(z => z.Mitglied)
            .Include(b => b.BankKonto)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<decimal> GetTotalAmountAsync(int bankKontoId, DateTime? fromDate = null, DateTime? toDate = null, CancellationToken cancellationToken = default)
    {
        IQueryable<BankBuchung> query = _dbSet.Where(b => b.BankKontoId == bankKontoId);

        if (fromDate.HasValue)
        {
            query = query.Where(b => b.Buchungsdatum >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(b => b.Buchungsdatum <= toDate.Value);
        }

        var total = await query.SumAsync(b => (decimal?)b.Betrag, cancellationToken);
        return total ?? 0;
    }
}

