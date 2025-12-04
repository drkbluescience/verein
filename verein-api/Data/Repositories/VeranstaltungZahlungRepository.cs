using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for VeranstaltungZahlung entity
/// </summary>
public class VeranstaltungZahlungRepository : Repository<VeranstaltungZahlung>, IVeranstaltungZahlungRepository
{
    public VeranstaltungZahlungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<VeranstaltungZahlung>> GetByVeranstaltungIdAsync(int veranstaltungId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(vz => vz.VeranstaltungId == veranstaltungId)
            .OrderByDescending(vz => vz.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungZahlung>> GetByAnmeldungIdAsync(int anmeldungId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(vz => vz.AnmeldungId == anmeldungId)
            .OrderByDescending(vz => vz.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungZahlung>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate, int? veranstaltungId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungZahlung> query = _dbSet;

        query = query.Where(vz => vz.Zahlungsdatum >= fromDate && vz.Zahlungsdatum <= toDate);

        if (veranstaltungId.HasValue)
        {
            query = query.Where(vz => vz.VeranstaltungId == veranstaltungId.Value);
        }

        return await query
            .OrderByDescending(vz => vz.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetTotalPaymentAmountAsync(int veranstaltungId, CancellationToken cancellationToken = default)
    {
        var total = await _dbSet
            .Where(vz => vz.VeranstaltungId == veranstaltungId)
            .SumAsync(vz => (decimal?)vz.Betrag, cancellationToken);

        return total ?? 0;
    }

    public async Task<VeranstaltungZahlung?> GetWithRelatedDataAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(vz => vz.Veranstaltung)
            .Include(vz => vz.Anmeldung)
                .ThenInclude(a => a!.Mitglied)
            .FirstOrDefaultAsync(vz => vz.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungZahlung>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungZahlung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Include(vz => vz.Veranstaltung)
            .Include(vz => vz.Anmeldung)
            .Where(vz => vz.Anmeldung != null && vz.Anmeldung.MitgliedId == mitgliedId)
            .OrderByDescending(vz => vz.Zahlungsdatum)
            .ToListAsync(cancellationToken);
    }
}

