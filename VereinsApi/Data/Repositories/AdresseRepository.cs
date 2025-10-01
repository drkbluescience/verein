using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Adresse entity with specific operations
/// </summary>
public class AdresseRepository : Repository<Adresse>, IAdresseRepository
{
    public AdresseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Adresse>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.VereinId == vereinId)
            .OrderBy(a => a.IstStandard == true ? 0 : 1)
            .ThenBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> GetByAddressTypeIdAsync(int addressTypeId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.AdresseTypId == addressTypeId)
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> GetByPostalCodeAsync(string postalCode, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.PLZ == postalCode)
            .OrderBy(a => a.Ort)
            .ThenBy(a => a.Strasse)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> GetByCityAsync(string city, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Ort != null && a.Ort.ToLower().Contains(city.ToLower()))
            .OrderBy(a => a.Ort)
            .ThenBy(a => a.Strasse)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> GetDefaultAddressesAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.IstStandard == true)
            .OrderBy(a => a.VereinId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> GetAddressesInAreaAsync(double centerLatitude, double centerLongitude, double radiusKm, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Using Haversine formula approximation for distance calculation
        return await query
            .Where(a => a.Latitude.HasValue && a.Longitude.HasValue)
            .Where(a => 
                Math.Sqrt(
                    Math.Pow(69.1 * (a.Latitude.Value - centerLatitude), 2) +
                    Math.Pow(69.1 * (centerLongitude - a.Longitude.Value) * Math.Cos(centerLatitude / 57.3), 2)
                ) <= radiusKm * 0.621371)
            .OrderBy(a => a.Ort)
            .ThenBy(a => a.Strasse)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> SearchAddressesAsync(string searchTerm, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var lowerSearchTerm = searchTerm.ToLower();
        return await query
            .Where(a => 
                (a.Strasse != null && a.Strasse.ToLower().Contains(lowerSearchTerm)) ||
                (a.Ort != null && a.Ort.ToLower().Contains(lowerSearchTerm)) ||
                (a.PLZ != null && a.PLZ.Contains(searchTerm)) ||
                (a.Stadtteil != null && a.Stadtteil.ToLower().Contains(lowerSearchTerm)))
            .OrderBy(a => a.Ort)
            .ThenBy(a => a.Strasse)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> GetValidAddressesForDateAsync(DateTime date, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => (a.GueltigVon == null || a.GueltigVon <= date) &&
                       (a.GueltigBis == null || a.GueltigBis >= date))
            .OrderBy(a => a.VereinId)
            .ThenBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsForVereinAndTypeAsync(int vereinId, int addressTypeId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;
        query = query.Where(a => a.VereinId == vereinId && a.AdresseTypId == addressTypeId);

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Adresse>> SearchAddressesAsync(string searchTerm, int? vereinId = null, int? addressTypeId = null, string? city = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Adresse> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (vereinId.HasValue)
        {
            query = query.Where(a => a.VereinId == vereinId.Value);
        }

        if (addressTypeId.HasValue)
        {
            query = query.Where(a => a.AdresseTypId == addressTypeId.Value);
        }

        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(a => a.Ort != null && a.Ort.ToLower().Contains(city.ToLower()));
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(a =>
                (a.Strasse != null && a.Strasse.ToLower().Contains(lowerSearchTerm)) ||
                (a.Ort != null && a.Ort.ToLower().Contains(lowerSearchTerm)) ||
                (a.PLZ != null && a.PLZ.Contains(searchTerm)) ||
                (a.Stadtteil != null && a.Stadtteil.ToLower().Contains(lowerSearchTerm)));
        }

        return await query
            .OrderBy(a => a.Ort)
            .ThenBy(a => a.Strasse)
            .ToListAsync(cancellationToken);
    }
}
