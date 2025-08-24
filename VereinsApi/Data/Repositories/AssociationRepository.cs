using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Association entity with specific operations
/// </summary>
public class AssociationRepository : Repository<Association>, IAssociationRepository
{
    public AssociationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Association?> GetByAssociationNumberAsync(string associationNumber, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(associationNumber))
            return null;

        return await _dbSet
            .FirstOrDefaultAsync(a => a.AssociationNumber == associationNumber, cancellationToken);
    }

    public async Task<Association?> GetByClientCodeAsync(string clientCode, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(clientCode))
            return null;

        return await _dbSet
            .FirstOrDefaultAsync(a => a.ClientCode == clientCode, cancellationToken);
    }

    public async Task<IEnumerable<Association>> SearchByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Enumerable.Empty<Association>();

        var searchTerm = name.Trim().ToLower();

        return await _dbSet
            .Where(a => a.Name.ToLower().Contains(searchTerm) || 
                       (a.ShortName != null && a.ShortName.ToLower().Contains(searchTerm)))
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Association>> GetActiveAssociationsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.IsActive)
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Association>> GetByFoundingDateRangeAsync(DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.FoundingDate.HasValue && 
                       a.FoundingDate.Value >= fromDate && 
                       a.FoundingDate.Value <= toDate)
            .OrderBy(a => a.FoundingDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Association>> GetByMinimumMemberCountAsync(int minMemberCount, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.MemberCount.HasValue && a.MemberCount.Value >= minMemberCount)
            .OrderByDescending(a => a.MemberCount)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsAssociationNumberUniqueAsync(string associationNumber, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(associationNumber))
            return true; // Null/empty values are considered unique

        var query = _dbSet.IgnoreQueryFilters()
            .Where(a => a.AssociationNumber == associationNumber);

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return !await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> IsClientCodeUniqueAsync(string clientCode, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(clientCode))
            return true; // Null/empty values are considered unique

        var query = _dbSet.IgnoreQueryFilters()
            .Where(a => a.ClientCode == clientCode);

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return !await query.AnyAsync(cancellationToken);
    }

    public override async Task<IEnumerable<Association>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Association> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .OrderBy(a => a.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Association>> GetPaginatedAsync(int page, int pageSize, string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Association> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var search = searchTerm.Trim().ToLower();
            query = query.Where(a => a.Name.ToLower().Contains(search) || 
                                   (a.ShortName != null && a.ShortName.ToLower().Contains(search)) ||
                                   (a.AssociationNumber != null && a.AssociationNumber.ToLower().Contains(search)));
        }

        return await query
            .OrderBy(a => a.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetTotalCountAsync(string? searchTerm = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Association> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var search = searchTerm.Trim().ToLower();
            query = query.Where(a => a.Name.ToLower().Contains(search) || 
                                   (a.ShortName != null && a.ShortName.ToLower().Contains(search)) ||
                                   (a.AssociationNumber != null && a.AssociationNumber.ToLower().Contains(search)));
        }

        return await query.CountAsync(cancellationToken);
    }
}
