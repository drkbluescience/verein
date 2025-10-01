using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Verein entity with specific operations
/// </summary>
public class VereinRepository : Repository<Verein>, IVereinRepository
{
    public VereinRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Verein?> GetByVereinNumberAsync(string vereinNumber, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(v => v.Vereinsnummer == vereinNumber, cancellationToken);
    }

    public async Task<Verein?> GetByClientCodeAsync(string clientCode, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(v => v.Mandantencode == clientCode, cancellationToken);
    }

    public async Task<IEnumerable<Verein>> SearchByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.Name.ToLower().Contains(name.ToLower()) || 
                       (v.Kurzname != null && v.Kurzname.ToLower().Contains(name.ToLower())))
            .OrderBy(v => v.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Verein>> GetActiveVereineAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.Aktiv == true)
            .OrderBy(v => v.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Verein>> GetByFoundingDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.Gruendungsdatum >= fromDate && v.Gruendungsdatum <= toDate)
            .OrderBy(v => v.Gruendungsdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsVereinNumberUniqueAsync(string vereinNumber, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Verein> query = _dbSet;
        query = query.Where(v => v.Vereinsnummer == vereinNumber);

        if (excludeId.HasValue)
        {
            query = query.Where(v => v.Id != excludeId.Value);
        }

        return !await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> IsClientCodeUniqueAsync(string clientCode, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Verein> query = _dbSet;
        query = query.Where(v => v.Mandantencode == clientCode);

        if (excludeId.HasValue)
        {
            query = query.Where(v => v.Id != excludeId.Value);
        }

        return !await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Verein>> GetPaginatedAsync(int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Verein> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Apply search filter if provided
        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(v => 
                (v.Name != null && v.Name.ToLower().Contains(lowerSearchTerm)) ||
                (v.Kurzname != null && v.Kurzname.ToLower().Contains(lowerSearchTerm)) ||
                (v.Vereinsnummer != null && v.Vereinsnummer.ToLower().Contains(lowerSearchTerm)) ||
                (v.Mandantencode != null && v.Mandantencode.ToLower().Contains(lowerSearchTerm)));
        }

        return await query
            .OrderBy(v => v.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetTotalCountAsync(string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Verein> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Apply search filter if provided
        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(v => 
                (v.Name != null && v.Name.ToLower().Contains(lowerSearchTerm)) ||
                (v.Kurzname != null && v.Kurzname.ToLower().Contains(lowerSearchTerm)) ||
                (v.Vereinsnummer != null && v.Vereinsnummer.ToLower().Contains(lowerSearchTerm)) ||
                (v.Mandantencode != null && v.Mandantencode.ToLower().Contains(lowerSearchTerm)));
        }

        return await query.CountAsync(cancellationToken);
    }
}
