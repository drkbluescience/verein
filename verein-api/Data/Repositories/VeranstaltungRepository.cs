using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.Domain.Models;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for Veranstaltung entity with specific operations
/// </summary>
public class VeranstaltungRepository : Repository<Veranstaltung>, IVeranstaltungRepository
{
    public VeranstaltungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Veranstaltung>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.VereinId == vereinId)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetUpcomingEventsAsync(DateTime? fromDate = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var startDate = fromDate ?? DateTime.UtcNow;
        return await query
            .Where(v => v.Startdatum >= startDate)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetPastEventsAsync(DateTime? toDate = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var endDate = toDate ?? DateTime.UtcNow;
        return await query
            .Where(v => v.Enddatum.HasValue ? v.Enddatum < endDate : v.Startdatum < endDate)
            .OrderByDescending(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.Startdatum >= startDate && v.Startdatum <= endDate)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetByLocationAsync(string location, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.Ort != null && v.Ort.ToLower().Contains(location.ToLower()))
            .OrderBy(v => v.Startdatum)
            .ThenBy(v => v.Titel)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetEventsRequiringRegistrationAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.AnmeldeErforderlich == true)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetPublicEventsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var events = await query
            .Where(v => v.MaxTeilnehmer.HasValue)
            .ToListAsync(cancellationToken);

        var eventsWithSpots = new List<Veranstaltung>();
        foreach (var veranstaltung in events)
        {
            if (await HasAvailableCapacityAsync(veranstaltung.Id, cancellationToken))
            {
                eventsWithSpots.Add(veranstaltung);
            }
        }

        return eventsWithSpots.OrderBy(v => v.Startdatum);
    }

    public async Task<IEnumerable<Veranstaltung>> GetEventsWithAvailableSpotsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        var events = await query
            .Where(v => v.MaxTeilnehmer.HasValue)
            .ToListAsync(cancellationToken);

        var eventsWithSpots = new List<Veranstaltung>();
        foreach (var veranstaltung in events)
        {
            if (await HasAvailableCapacityAsync(veranstaltung.Id, cancellationToken))
            {
                eventsWithSpots.Add(veranstaltung);
            }
        }

        return eventsWithSpots.OrderBy(v => v.Startdatum);
    }

    public async Task<IEnumerable<Veranstaltung>> GetMemberOnlyEventsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.NurFuerMitglieder == true)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetFreeEventsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.Preis == 0 || v.Preis == null)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetPaidEventsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(v => v.Preis > 0)
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetEventsByPriceRangeAsync(decimal? minPrice = null, decimal? maxPrice = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (minPrice.HasValue)
        {
            query = query.Where(v => v.Preis >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(v => v.Preis <= maxPrice.Value);
        }

        return await query
            .OrderBy(v => v.Startdatum)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> GetPopularEventsAsync(int limit = 10, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Get events with their registration counts
        var eventsWithCounts = await query
            .Select(v => new { Event = v, RegistrationCount = _context.Set<VeranstaltungAnmeldung>().Count(a => a.VeranstaltungId == v.Id) })
            .OrderByDescending(x => x.RegistrationCount)
            .Take(limit)
            .ToListAsync(cancellationToken);

        return eventsWithCounts.Select(x => x.Event);
    }

    public async Task<bool> HasScheduleConflictAsync(int vereinId, DateTime startDateTime, DateTime? endDateTime = null, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;
        query = query.Where(v => v.VereinId == vereinId);

        if (excludeId.HasValue)
        {
            query = query.Where(v => v.Id != excludeId.Value);
        }

        var effectiveEndDateTime = endDateTime ?? startDateTime.AddHours(1); // Default 1 hour duration

        return await query.AnyAsync(v =>
            (v.Startdatum <= startDateTime && (v.Enddatum ?? v.Startdatum.AddHours(1)) > startDateTime) ||
            (v.Startdatum < effectiveEndDateTime && (v.Enddatum ?? v.Startdatum.AddHours(1)) >= effectiveEndDateTime) ||
            (startDateTime <= v.Startdatum && effectiveEndDateTime > v.Startdatum),
            cancellationToken);
    }

    public async Task<IEnumerable<Veranstaltung>> SearchEventsAsync(string searchTerm, int? vereinId = null, DateTime? startDate = null, DateTime? endDate = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        // Apply search term filter
        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(v => 
                (v.Titel != null && v.Titel.ToLower().Contains(lowerSearchTerm)) ||
                (v.Beschreibung != null && v.Beschreibung.ToLower().Contains(lowerSearchTerm)) ||
                (v.Ort != null && v.Ort.ToLower().Contains(lowerSearchTerm)));
        }

        // Apply optional filters
        if (vereinId.HasValue)
        {
            query = query.Where(v => v.VereinId == vereinId.Value);
        }

        if (startDate.HasValue)
        {
            query = query.Where(v => v.Startdatum >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(v => v.Enddatum.HasValue ? v.Enddatum <= endDate.Value : v.Startdatum <= endDate.Value);
        }

        return await query
            .OrderBy(v => v.Startdatum)
            .ThenBy(v => v.Titel)
            .ToListAsync(cancellationToken);
    }

    public async Task<EventStatistics> GetEventStatisticsAsync(int vereinId, int? year = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Veranstaltung> query = _dbSet;
        query = query.Where(v => v.VereinId == vereinId);

        if (year.HasValue)
        {
            query = query.Where(v => v.Startdatum.Year == year.Value);
        }

        var now = DateTime.UtcNow;
        var events = await query.ToListAsync(cancellationToken);

        var statistics = new EventStatistics
        {
            TotalEvents = events.Count,
            UpcomingEvents = events.Count(e => e.Startdatum >= now),
            PastEvents = events.Count(e => e.Enddatum.HasValue ? e.Enddatum < now : e.Startdatum < now),
            OngoingEvents = events.Count(e => e.Startdatum <= now && (e.Enddatum == null || e.Enddatum >= now)),
            EventsRequiringRegistration = events.Count(e => e.AnmeldeErforderlich == true),
            MemberOnlyEvents = events.Count(e => e.NurFuerMitglieder == true),
            PublicEvents = events.Count(e => e.NurFuerMitglieder == false),
            FreeEvents = events.Count(e => e.Preis == 0 || e.Preis == null),
            PaidEvents = events.Count(e => e.Preis > 0),
            AverageEventPrice = events.Where(e => e.Preis.HasValue).Average(e => e.Preis) ?? 0,
            TotalRevenue = events.Where(e => e.Preis.HasValue).Sum(e => e.Preis) ?? 0
        };

        return statistics;
    }

    public async Task<int> GetRegistrationCountAsync(int eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<VeranstaltungAnmeldung>()
            .Where(a => a.VeranstaltungId == eventId && 
                       a.Status != "Cancelled" && a.Status != "Storniert")
            .CountAsync(cancellationToken);
    }

    public async Task<bool> HasAvailableCapacityAsync(int eventId, CancellationToken cancellationToken = default)
    {
        var veranstaltung = await _dbSet
            .FirstOrDefaultAsync(v => v.Id == eventId, cancellationToken);

        if (veranstaltung?.MaxTeilnehmer == null)
            return true; // No capacity limit

        var registrationCount = await GetRegistrationCountAsync(eventId, cancellationToken);
        return registrationCount < veranstaltung.MaxTeilnehmer;
    }
}
