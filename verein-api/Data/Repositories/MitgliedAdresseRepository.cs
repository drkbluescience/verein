using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for MitgliedAdresse entity with specific operations
/// </summary>
public class MitgliedAdresseRepository : Repository<MitgliedAdresse>, IMitgliedAdresseRepository
{
    public MitgliedAdresseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedAdresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.MitgliedId == mitgliedId)
            .OrderByDescending(a => a.IstStandard)
            .ThenBy(a => a.AdresseTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetByAddressTypeAsync(int adresseTypId, int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedAdresse> query = _dbSet.Where(a => a.AdresseTypId == adresseTypId);

        if (mitgliedId.HasValue)
        {
            query = query.Where(a => a.MitgliedId == mitgliedId.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<MitgliedAdresse?> GetStandardAddressAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.MitgliedId == mitgliedId && a.IstStandard == true)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetByPostalCodeAsync(string plz, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.PLZ == plz)
            .Include(a => a.Mitglied)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetByCityAsync(string ort, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.Ort == ort)
            .Include(a => a.Mitglied)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetByGeographicAreaAsync(double minLatitude, double maxLatitude, double minLongitude, double maxLongitude, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.Latitude.HasValue && a.Longitude.HasValue &&
                       a.Latitude.Value >= minLatitude && a.Latitude.Value <= maxLatitude &&
                       a.Longitude.Value >= minLongitude && a.Longitude.Value <= maxLongitude)
            .Include(a => a.Mitglied)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedAdresse> query = _dbSet.Where(a => 
            (a.GueltigVon == null || a.GueltigVon <= date) &&
            (a.GueltigBis == null || a.GueltigBis >= date));

        if (mitgliedId.HasValue)
        {
            query = query.Where(a => a.MitgliedId == mitgliedId.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedAdresse>> GetActiveAddressesAsync(int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedAdresse> query = _dbSet.Where(a => a.Aktiv == true);

        if (mitgliedId.HasValue)
        {
            query = query.Where(a => a.MitgliedId == mitgliedId.Value);
        }

        return await query
            .OrderByDescending(a => a.IstStandard)
            .ThenBy(a => a.AdresseTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task SetAsStandardAddressAsync(int mitgliedId, int addressId, CancellationToken cancellationToken = default)
    {
        // First, unset all standard addresses for this mitglied
        var existingStandardAddresses = await _dbSet
            .Where(a => a.MitgliedId == mitgliedId && a.IstStandard == true)
            .ToListAsync(cancellationToken);

        foreach (var address in existingStandardAddresses)
        {
            address.IstStandard = false;
            address.Modified = DateTime.UtcNow;
        }

        // Then set the specified address as standard
        var targetAddress = await _dbSet
            .FirstOrDefaultAsync(a => a.Id == addressId && a.MitgliedId == mitgliedId, cancellationToken);

        if (targetAddress != null)
        {
            targetAddress.IstStandard = true;
            targetAddress.Modified = DateTime.UtcNow;
        }
    }

    public async Task<bool> HasAddressesAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(a => a.MitgliedId == mitgliedId, cancellationToken);
    }

    public async Task<int> GetCountByMitgliedAsync(int mitgliedId, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedAdresse> query = _dbSet.Where(a => a.MitgliedId == mitgliedId);

        if (activeOnly)
        {
            query = query.Where(a => a.Aktiv == true);
        }

        return await query.CountAsync(cancellationToken);
    }
}
