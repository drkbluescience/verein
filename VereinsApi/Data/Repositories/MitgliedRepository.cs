using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Mitglied entity with specific operations
/// </summary>
public class MitgliedRepository : Repository<Mitglied>, IMitgliedRepository
{
    public MitgliedRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Mitglied?> GetByMitgliedsnummerAsync(string mitgliedsnummer, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(m => m.Mitgliedsnummer == mitgliedsnummer, cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(m => m.VereinId == vereinId)
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(m => m.Email == email)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> SearchByNameAsync(string? vorname, string? nachname, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet;

        if (!string.IsNullOrEmpty(vorname))
        {
            query = query.Where(m => m.Vorname.Contains(vorname));
        }

        if (!string.IsNullOrEmpty(nachname))
        {
            query = query.Where(m => m.Nachname.Contains(nachname));
        }

        if (vereinId.HasValue)
        {
            query = query.Where(m => m.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetActiveMitgliederAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.Where(m => m.Aktiv == true);

        if (vereinId.HasValue)
        {
            query = query.Where(m => m.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.Where(m => m.MitgliedStatusId == statusId);

        if (vereinId.HasValue)
        {
            query = query.Where(m => m.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetByTypAsync(int typId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.Where(m => m.MitgliedTypId == typId);

        if (vereinId.HasValue)
        {
            query = query.Where(m => m.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetByJoinDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.Where(m => 
            m.Eintrittsdatum.HasValue && 
            m.Eintrittsdatum.Value >= fromDate && 
            m.Eintrittsdatum.Value <= toDate);

        if (vereinId.HasValue)
        {
            query = query.Where(m => m.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(m => m.Eintrittsdatum)
            .ThenBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetByBirthdayRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.Where(m => 
            m.Geburtsdatum.HasValue && 
            m.Geburtsdatum.Value >= fromDate && 
            m.Geburtsdatum.Value <= toDate);

        if (vereinId.HasValue)
        {
            query = query.Where(m => m.VereinId == vereinId.Value);
        }

        return await query
            .OrderBy(m => m.Geburtsdatum)
            .ThenBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<Mitglied?> GetWithAddressesAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(m => m.MitgliedAdressen.Where(a => a.DeletedFlag != true))
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Mitglied?> GetWithFamilyAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(m => m.FamilienbeziehungenAlsKind.Where(f => f.DeletedFlag != true))
                .ThenInclude(f => f.ParentMitglied)
            .Include(m => m.FamilienbeziehungenAlsElternteil.Where(f => f.DeletedFlag != true))
                .ThenInclude(f => f.Mitglied)
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Mitglied?> GetFullAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(m => m.MitgliedAdressen.Where(a => a.DeletedFlag != true))
            .Include(m => m.FamilienbeziehungenAlsKind.Where(f => f.DeletedFlag != true))
                .ThenInclude(f => f.ParentMitglied)
            .Include(m => m.FamilienbeziehungenAlsElternteil.Where(f => f.DeletedFlag != true))
                .ThenInclude(f => f.Mitglied)
            .Include(m => m.VeranstaltungAnmeldungen.Where(v => v.DeletedFlag != true))
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<bool> IsMitgliedsnummerUniqueAsync(string mitgliedsnummer, int vereinId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.IgnoreQueryFilters()
            .Where(m => m.Mitgliedsnummer == mitgliedsnummer && m.VereinId == vereinId);

        if (excludeId.HasValue)
        {
            query = query.Where(m => m.Id != excludeId.Value);
        }

        return !await query.AnyAsync(cancellationToken);
    }

    public async Task<int> GetCountByVereinAsync(int vereinId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        IQueryable<Mitglied> query = _dbSet.Where(m => m.VereinId == vereinId);

        if (activeOnly)
        {
            query = query.Where(m => m.Aktiv == true);
        }

        return await query.CountAsync(cancellationToken);
    }
}
