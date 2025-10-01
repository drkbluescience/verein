using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for MitgliedFamilie entity with specific operations
/// </summary>
public class MitgliedFamilieRepository : Repository<MitgliedFamilie>, IMitgliedFamilieRepository
{
    public MitgliedFamilieRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(f => f.MitgliedId == mitgliedId)
            .Include(f => f.ParentMitglied)
            .OrderBy(f => f.FamilienbeziehungTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetByParentMitgliedIdAsync(int parentMitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(f => f.ParentMitgliedId == parentMitgliedId)
            .Include(f => f.Mitglied)
            .OrderBy(f => f.FamilienbeziehungTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetAllRelationshipsAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(f => f.MitgliedId == mitgliedId || f.ParentMitgliedId == mitgliedId)
            .Include(f => f.Mitglied)
            .Include(f => f.ParentMitglied)
            .OrderBy(f => f.FamilienbeziehungTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(f => f.VereinId == vereinId)
            .Include(f => f.Mitglied)
            .Include(f => f.ParentMitglied)
            .OrderBy(f => f.FamilienbeziehungTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetByRelationshipTypeAsync(int familienbeziehungTypId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet.Where(f => f.FamilienbeziehungTypId == familienbeziehungTypId);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .Include(f => f.Mitglied)
            .Include(f => f.ParentMitglied)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetByStatusAsync(int statusId, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet.Where(f => f.MitgliedFamilieStatusId == statusId);

        if (vereinId.HasValue)
        {
            query = query.Where(f => f.VereinId == vereinId.Value);
        }

        return await query
            .Include(f => f.Mitglied)
            .Include(f => f.ParentMitglied)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetValidAtDateAsync(DateTime date, int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet.Where(f => 
            (f.GueltigVon == null || f.GueltigVon <= date) &&
            (f.GueltigBis == null || f.GueltigBis >= date));

        if (mitgliedId.HasValue)
        {
            query = query.Where(f => f.MitgliedId == mitgliedId.Value || f.ParentMitgliedId == mitgliedId.Value);
        }

        return await query
            .Include(f => f.Mitglied)
            .Include(f => f.ParentMitglied)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<MitgliedFamilie>> GetActiveRelationshipsAsync(int? mitgliedId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet.Where(f => f.Aktiv == true);

        if (mitgliedId.HasValue)
        {
            query = query.Where(f => f.MitgliedId == mitgliedId.Value || f.ParentMitgliedId == mitgliedId.Value);
        }

        return await query
            .Include(f => f.Mitglied)
            .Include(f => f.ParentMitglied)
            .OrderBy(f => f.FamilienbeziehungTypId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetChildrenAsync(int parentMitgliedId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.ParentMitgliedId == parentMitgliedId && f.Aktiv == true)
            .Select(f => f.Mitglied!)
            .Where(m => m != null)
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Mitglied>> GetParentsAsync(int childMitgliedId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.MitgliedId == childMitgliedId && f.Aktiv == true)
            .Select(f => f.ParentMitglied!)
            .Where(m => m != null)
            .OrderBy(m => m.Nachname)
            .ThenBy(m => m.Vorname)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> RelationshipExistsAsync(int mitgliedId, int parentMitgliedId, int familienbeziehungTypId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet.IgnoreQueryFilters()
            .Where(f => f.MitgliedId == mitgliedId && 
                       f.ParentMitgliedId == parentMitgliedId && 
                       f.FamilienbeziehungTypId == familienbeziehungTypId);

        if (excludeId.HasValue)
        {
            query = query.Where(f => f.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> WouldCreateCircularReferenceAsync(int mitgliedId, int parentMitgliedId, CancellationToken cancellationToken = default)
    {
        // Check if parentMitgliedId is already a child of mitgliedId (direct or indirect)
        return await IsDescendantAsync(parentMitgliedId, mitgliedId, cancellationToken);
    }

    private async Task<bool> IsDescendantAsync(int potentialDescendantId, int ancestorId, CancellationToken cancellationToken, HashSet<int>? visited = null)
    {
        visited ??= new HashSet<int>();

        // Prevent infinite loops
        if (visited.Contains(potentialDescendantId))
        {
            return false;
        }

        visited.Add(potentialDescendantId);

        // Get all parents of the potential descendant
        var parentIds = await _dbSet
            .Where(f => f.MitgliedId == potentialDescendantId && f.Aktiv == true)
            .Select(f => f.ParentMitgliedId)
            .ToListAsync(cancellationToken);

        // Check if ancestor is a direct parent
        if (parentIds.Contains(ancestorId))
        {
            return true;
        }

        // Recursively check if ancestor is an indirect parent
        foreach (var parentId in parentIds)
        {
            if (await IsDescendantAsync(parentId, ancestorId, cancellationToken, visited))
            {
                return true;
            }
        }

        return false;
    }

    public async Task<int> GetCountByMitgliedAsync(int mitgliedId, bool asChild = true, bool asParent = true, bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        IQueryable<MitgliedFamilie> query = _dbSet;

        if (activeOnly)
        {
            query = query.Where(f => f.Aktiv == true);
        }

        if (asChild && asParent)
        {
            query = query.Where(f => f.MitgliedId == mitgliedId || f.ParentMitgliedId == mitgliedId);
        }
        else if (asChild)
        {
            query = query.Where(f => f.MitgliedId == mitgliedId);
        }
        else if (asParent)
        {
            query = query.Where(f => f.ParentMitgliedId == mitgliedId);
        }
        else
        {
            return 0; // Neither as child nor as parent
        }

        return await query.CountAsync(cancellationToken);
    }
}
