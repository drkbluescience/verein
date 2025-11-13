using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Verein entity with specific operations
/// </summary>
public class VereinRepository : Repository<Verein>, IVereinRepository
{
    private readonly ILogger<VereinRepository> _logger;

    public VereinRepository(ApplicationDbContext context, ILogger<VereinRepository> logger) : base(context)
    {
        _logger = logger;
        _logger.LogInformation("VereinRepository constructor called");
    }

    /// <summary>
    /// Override GetAllAsync to include RechtlicheDaten
    /// </summary>
    public override async Task<IEnumerable<Verein>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Verein> query = _dbSet.Include(v => v.RechtlicheDaten);

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query.ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Override GetByIdAsync to include RechtlicheDaten
    /// </summary>
    public override async Task<Verein?> GetByIdAsync(int id, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("GetByIdAsync called for Verein ID {VereinId}", id);

        IQueryable<Verein> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var verein = await query.FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        _logger.LogDebug("Verein loaded: {VereinFound}", verein != null);

        if (verein != null)
        {
            _logger.LogDebug("Attempting to load RechtlicheDaten for Verein ID {VereinId}", id);

            // Manually load RechtlicheDaten - global query filter already handles DeletedFlag
            var rechtlicheDatenQuery = _context.Set<RechtlicheDaten>()
                .Where(r => r.VereinId == id);

            if (includeDeleted)
            {
                rechtlicheDatenQuery = rechtlicheDatenQuery.IgnoreQueryFilters();
            }

            var rechtlicheDaten = await rechtlicheDatenQuery.FirstOrDefaultAsync(cancellationToken);
            _logger.LogDebug("RechtlicheDaten loaded: {RechtlicheDatenFound}, VereinId: {VereinId}", rechtlicheDaten != null, rechtlicheDaten?.VereinId);

            verein.RechtlicheDaten = rechtlicheDaten;
            _logger.LogDebug("RechtlicheDaten assigned to Verein. Verein.RechtlicheDaten is null: {IsNull}", verein.RechtlicheDaten == null);
        }

        return verein;
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
