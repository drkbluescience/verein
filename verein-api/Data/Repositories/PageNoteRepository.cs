using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Enums;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.PageNote;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for PageNote entity with specific operations
/// </summary>
public class PageNoteRepository : Repository<PageNote>, IPageNoteRepository
{
    private readonly IMapper _mapper;

    public PageNoteRepository(ApplicationDbContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<IEnumerable<PageNote>> GetByUserEmailAsync(string userEmail, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(p => p.UserEmail == userEmail)
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PageNote>> GetByPageUrlAsync(string pageUrl, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(p => p.PageUrl == pageUrl)
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PageNote>> GetByEntityAsync(string entityType, int entityId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(p => p.EntityType == entityType && p.EntityId == entityId)
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PageNote>> GetByStatusAsync(PageNoteStatus status, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(p => p.Status == status)
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PageNote>> GetByCategoryAsync(PageNoteCategory category, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(p => p.Category == category)
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PageNote>> GetByPriorityAsync(PageNotePriority priority, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(p => p.Priority == priority)
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PageNote>> GetAllNotesAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<PageNote> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .OrderByDescending(p => p.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<PageNoteStatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var stats = new PageNoteStatisticsDto
        {
            // Total notes
            TotalNotes = await _dbSet.CountAsync(cancellationToken),

            // By status
            PendingNotes = await _dbSet.CountAsync(p => p.Status == PageNoteStatus.Pending, cancellationToken),
            InProgressNotes = await _dbSet.CountAsync(p => p.Status == PageNoteStatus.InProgress, cancellationToken),
            CompletedNotes = await _dbSet.CountAsync(p => p.Status == PageNoteStatus.Completed, cancellationToken),
            RejectedNotes = await _dbSet.CountAsync(p => p.Status == PageNoteStatus.Rejected, cancellationToken),

            // By category
            NotesByCategory = new Dictionary<PageNoteCategory, int>
            {
                { PageNoteCategory.General, await _dbSet.CountAsync(p => p.Category == PageNoteCategory.General, cancellationToken) },
                { PageNoteCategory.Bug, await _dbSet.CountAsync(p => p.Category == PageNoteCategory.Bug, cancellationToken) },
                { PageNoteCategory.Feature, await _dbSet.CountAsync(p => p.Category == PageNoteCategory.Feature, cancellationToken) },
                { PageNoteCategory.Question, await _dbSet.CountAsync(p => p.Category == PageNoteCategory.Question, cancellationToken) },
                { PageNoteCategory.Improvement, await _dbSet.CountAsync(p => p.Category == PageNoteCategory.Improvement, cancellationToken) },
                { PageNoteCategory.DataCorrection, await _dbSet.CountAsync(p => p.Category == PageNoteCategory.DataCorrection, cancellationToken) }
            },

            // By priority
            NotesByPriority = new Dictionary<PageNotePriority, int>
            {
                { PageNotePriority.Low, await _dbSet.CountAsync(p => p.Priority == PageNotePriority.Low, cancellationToken) },
                { PageNotePriority.Medium, await _dbSet.CountAsync(p => p.Priority == PageNotePriority.Medium, cancellationToken) },
                { PageNotePriority.High, await _dbSet.CountAsync(p => p.Priority == PageNotePriority.High, cancellationToken) },
                { PageNotePriority.Critical, await _dbSet.CountAsync(p => p.Priority == PageNotePriority.Critical, cancellationToken) }
            },

            // By user
            NotesByUser = await _dbSet
                .GroupBy(p => new { p.UserEmail, p.UserName })
                .Select(g => new UserNoteCount
                {
                    UserEmail = g.Key.UserEmail,
                    UserName = g.Key.UserName,
                    Count = g.Count()
                })
                .OrderByDescending(u => u.Count)
                .ToListAsync(cancellationToken),

            // Recent notes (last 10)
            RecentNotes = _mapper.Map<List<PageNoteDto>>(await _dbSet
                .OrderByDescending(p => p.Created)
                .Take(10)
                .ToListAsync(cancellationToken))
        };

        return stats;
    }
}

