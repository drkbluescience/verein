using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for VeranstaltungBild entity with specific operations
/// </summary>
public class VeranstaltungBildRepository : Repository<VeranstaltungBild>, IVeranstaltungBildRepository
{
    public VeranstaltungBildRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<VeranstaltungBild>> GetByEventIdAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.VeranstaltungId == eventId)
            .OrderBy(b => b.Reihenfolge)
            .ThenBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<VeranstaltungBild?> GetMainImageAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Get the image with the lowest sort order (first image)
        return await query
            .Where(b => b.VeranstaltungId == eventId)
            .OrderBy(b => b.Reihenfolge)
            .ThenBy(b => b.Created)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungBild>> GetBySortOrderRangeAsync(int eventId, int minSortOrder, int maxSortOrder, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.VeranstaltungId == eventId && 
                       b.Reihenfolge >= minSortOrder && 
                       b.Reihenfolge <= maxSortOrder)
            .OrderBy(b => b.Reihenfolge)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungBild>> GetByPathPatternAsync(string pathPattern, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(b => b.BildPfad.Contains(pathPattern))
            .OrderBy(b => b.VeranstaltungId)
            .ThenBy(b => b.Reihenfolge)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> MainImageExistsAsync(int eventId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        // Since we don't have IstHauptbild property, we consider the first image (lowest sort order) as main
        IQueryable<VeranstaltungBild> query = _dbSet;
        query = query.Where(b => b.VeranstaltungId == eventId);

        if (excludeId.HasValue)
        {
            query = query.Where(b => b.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<int> GetNextSortOrderAsync(int eventId, CancellationToken cancellationToken = default)
    {
        var maxSortOrder = await _dbSet
            .Where(b => b.VeranstaltungId == eventId)
            .MaxAsync(b => (int?)b.Reihenfolge, cancellationToken);

        return (maxSortOrder ?? 0) + 1;
    }

    public async Task<IEnumerable<VeranstaltungBild>> GetDuplicateSortOrdersAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var duplicateOrders = await query
            .Where(b => b.VeranstaltungId == eventId)
            .GroupBy(b => b.Reihenfolge)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToListAsync(cancellationToken);

        return await query
            .Where(b => b.VeranstaltungId == eventId && duplicateOrders.Contains(b.Reihenfolge))
            .OrderBy(b => b.Reihenfolge)
            .ThenBy(b => b.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task ReorderImagesAsync(int eventId, Dictionary<int, int> imageOrders, CancellationToken cancellationToken = default)
    {
        var images = await _dbSet
            .Where(b => b.VeranstaltungId == eventId && imageOrders.Keys.Contains(b.Id))
            .ToListAsync(cancellationToken);

        foreach (var image in images)
        {
            if (imageOrders.TryGetValue(image.Id, out var newOrder))
            {
                image.Reihenfolge = newOrder;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungBild>> GetAllMainImagesAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Get the first image (lowest sort order) for each event
        var mainImages = await query
            .GroupBy(b => b.VeranstaltungId)
            .Select(g => g.OrderBy(b => b.Reihenfolge).ThenBy(b => b.Created).First())
            .ToListAsync(cancellationToken);

        return mainImages;
    }

    public async Task<IEnumerable<VeranstaltungBild>> SearchImagesAsync(string searchTerm, int? eventId = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungBild> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (eventId.HasValue)
        {
            query = query.Where(b => b.VeranstaltungId == eventId.Value);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(b => 
                (b.Titel != null && b.Titel.ToLower().Contains(lowerSearchTerm)) ||
                b.BildPfad.ToLower().Contains(lowerSearchTerm));
        }

        return await query
            .OrderBy(b => b.VeranstaltungId)
            .ThenBy(b => b.Reihenfolge)
            .ToListAsync(cancellationToken);
    }
}
