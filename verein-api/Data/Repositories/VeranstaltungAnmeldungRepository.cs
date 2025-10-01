using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.Domain.Models;

namespace VereinsApi.Data.Repositories;

/// <summary>
/// Repository implementation for VeranstaltungAnmeldung entity with specific operations
/// </summary>
public class VeranstaltungAnmeldungRepository : Repository<VeranstaltungAnmeldung>, IVeranstaltungAnmeldungRepository
{
    public VeranstaltungAnmeldungRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetByEventIdAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.VeranstaltungId == eventId)
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetByMemberIdAsync(int memberId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.MitgliedId == memberId)
            .OrderByDescending(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetByStatusAsync(string status, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Status == status)
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetByEmailAsync(string email, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Email != null && a.Email.ToLower() == email.ToLower())
            .OrderByDescending(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetByPaymentStatusIdAsync(int paymentStatusId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.ZahlungStatusId == paymentStatusId)
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetPendingRegistrationsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Status == "Pending" || a.Status == "Wartend")
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetConfirmedRegistrationsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Status == "Confirmed" || a.Status == "Bestätigt")
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetCancelledRegistrationsAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Status == "Cancelled" || a.Status == "Storniert")
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsForEventAndMemberAsync(int eventId, int memberId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;
        query = query.Where(a => a.VeranstaltungId == eventId && a.MitgliedId == memberId);

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> ExistsForEventAndEmailAsync(int eventId, string email, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;
        query = query.Where(a => a.VeranstaltungId == eventId && a.Email != null && a.Email.ToLower() == email.ToLower());

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<int> GetRegistrationCountForEventAsync(int eventId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(a => a.VeranstaltungId == eventId && 
                       a.Status != "Cancelled" && a.Status != "Storniert")
            .CountAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> SearchRegistrationsAsync(string searchTerm, int? eventId = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (eventId.HasValue)
        {
            query = query.Where(a => a.VeranstaltungId == eventId.Value);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(a => 
                (a.Name != null && a.Name.ToLower().Contains(lowerSearchTerm)) ||
                (a.Email != null && a.Email.ToLower().Contains(lowerSearchTerm)) ||
                (a.Telefon != null && a.Telefon.Contains(searchTerm)));
        }

        return await query
            .OrderByDescending(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetByPaymentStatusAsync(int paymentStatusId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.ZahlungStatusId == paymentStatusId)
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetRegistrationsByDateRangeAsync(DateTime startDate, DateTime endDate, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.Created >= startDate && a.Created <= endDate)
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetConfirmedRegistrationsAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.VeranstaltungId == eventId && (a.Status == "Confirmed" || a.Status == "Bestätigt"))
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetPendingRegistrationsAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.VeranstaltungId == eventId && (a.Status == "Pending" || a.Status == "Wartend"))
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetCancelledRegistrationsAsync(int eventId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.VeranstaltungId == eventId && (a.Status == "Cancelled" || a.Status == "Storniert"))
            .OrderBy(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> SearchRegistrationsAsync(string searchTerm, int? eventId = null, int? memberId = null, string? status = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (eventId.HasValue)
        {
            query = query.Where(a => a.VeranstaltungId == eventId.Value);
        }

        if (memberId.HasValue)
        {
            query = query.Where(a => a.MitgliedId == memberId.Value);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.Status == status);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(a =>
                (a.Name != null && a.Name.ToLower().Contains(lowerSearchTerm)) ||
                (a.Email != null && a.Email.ToLower().Contains(lowerSearchTerm)) ||
                (a.Telefon != null && a.Telefon.Contains(searchTerm)));
        }

        return await query
            .OrderByDescending(a => a.Created)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetRegistrationCountAsync(int eventId, string? status = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        query = query.Where(a => a.VeranstaltungId == eventId);

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.Status == status);
        }
        else
        {
            // Exclude cancelled registrations by default
            query = query.Where(a => a.Status != "Cancelled" && a.Status != "Storniert");
        }

        return await query.CountAsync(cancellationToken);
    }

    public async Task<bool> IsMemberRegisteredAsync(int eventId, int memberId, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;
        query = query.Where(a => a.VeranstaltungId == eventId && a.MitgliedId == memberId);

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<bool> IsEmailRegisteredAsync(int eventId, string email, int? excludeId = null, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;
        query = query.Where(a => a.VeranstaltungId == eventId && a.Email != null && a.Email.ToLower() == email.ToLower());

        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<RegistrationStatistics> GetRegistrationStatisticsAsync(int eventId, CancellationToken cancellationToken = default)
    {
        var registrations = await _dbSet
            .Where(a => a.VeranstaltungId == eventId)
            .ToListAsync(cancellationToken);

        var statistics = new RegistrationStatistics
        {
            TotalRegistrations = registrations.Count,
            ConfirmedRegistrations = registrations.Count(r => r.Status == "Confirmed" || r.Status == "Bestätigt"),
            PendingRegistrations = registrations.Count(r => r.Status == "Pending" || r.Status == "Wartend"),
            CancelledRegistrations = registrations.Count(r => r.Status == "Cancelled" || r.Status == "Storniert"),
            TotalRevenue = registrations.Where(r => r.Preis.HasValue).Sum(r => r.Preis) ?? 0,
            MemberRegistrations = registrations.Count(r => r.MitgliedId.HasValue),
            NonMemberRegistrations = registrations.Count(r => !r.MitgliedId.HasValue),
            AverageRegistrationPrice = registrations.Where(r => r.Preis.HasValue).Any()
                ? registrations.Where(r => r.Preis.HasValue).Average(r => r.Preis.Value)
                : 0,
            RegistrationsByDate = registrations
                .GroupBy(r => r.Created.HasValue ? r.Created.Value.Date : DateTime.Today)
                .ToDictionary(g => g.Key, g => g.Count())
        };

        return statistics;
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetRegistrationsByPriceRangeAsync(decimal? minPrice = null, decimal? maxPrice = null, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        if (minPrice.HasValue)
        {
            query = query.Where(a => a.Preis >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(a => a.Preis <= maxPrice.Value);
        }

        return await query
            .OrderBy(a => a.Preis)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VeranstaltungAnmeldung>> GetRecentRegistrationsAsync(int eventId, int limit, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        IQueryable<VeranstaltungAnmeldung> query = _dbSet;

        if (includeDeleted)
        {
            query = query.IgnoreQueryFilters();
        }

        return await query
            .Where(a => a.VeranstaltungId == eventId)
            .OrderByDescending(a => a.Created)
            .Take(limit)
            .ToListAsync(cancellationToken);
    }
}
