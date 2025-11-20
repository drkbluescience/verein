using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.DTOs.Finanz;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service for Finanz Dashboard statistics and aggregations
/// Provides optimized queries for dashboard data
/// </summary>
public class FinanzDashboardService : IFinanzDashboardService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FinanzDashboardService> _logger;

    public FinanzDashboardService(
        ApplicationDbContext context,
        ILogger<FinanzDashboardService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get dashboard statistics with optimized aggregation queries
    /// </summary>
    public async Task<FinanzDashboardStatsDto> GetDashboardStatsAsync(
        int? vereinId = null,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting dashboard stats for vereinId: {VereinId}", vereinId);

        var stats = new FinanzDashboardStatsDto();

        // Get income statistics
        stats.Gelir = await GetGelirStatsAsync(vereinId, cancellationToken);

        // Get expense statistics
        stats.Gider = await GetGiderStatsAsync(vereinId, cancellationToken);

        // Get Verein comparison (Admin only - when vereinId is null)
        if (vereinId == null)
        {
            stats.VereinComparison = await GetVereinComparisonAsync(cancellationToken);
        }

        return stats;
    }

    /// <summary>
    /// Get income (Gelir) statistics
    /// </summary>
    private async Task<GelirStatsDto> GetGelirStatsAsync(int? vereinId, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        // Base query for Forderungen
        var forderungenQuery = _context.MitgliedForderungen
            .Where(f => f.DeletedFlag != true);

        if (vereinId.HasValue)
        {
            forderungenQuery = forderungenQuery.Where(f => f.VereinId == vereinId.Value);
        }

        // Aggregate Forderungen statistics
        var forderungenStats = await forderungenQuery
            .GroupBy(f => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Bezahlt = g.Count(f => f.StatusId == 1),
                Offen = g.Count(f => f.StatusId == 2),
                Ueberfaellig = g.Count(f => f.StatusId == 2 && f.Faelligkeit < today),
                TotalAmount = g.Sum(f => f.Betrag),
                BezahltAmount = g.Where(f => f.StatusId == 1).Sum(f => f.Betrag),
                OffenAmount = g.Where(f => f.StatusId == 2).Sum(f => f.Betrag),
                UeberfaelligAmount = g.Where(f => f.StatusId == 2 && f.Faelligkeit < today).Sum(f => f.Betrag)
            })
            .FirstOrDefaultAsync(cancellationToken);

        // Base query for Zahlungen
        var zahlungenQuery = _context.MitgliedZahlungen
            .Where(z => z.DeletedFlag != true);

        if (vereinId.HasValue)
        {
            zahlungenQuery = zahlungenQuery.Where(z => z.VereinId == vereinId.Value);
        }

        // Aggregate Zahlungen statistics
        var zahlungenStats = await zahlungenQuery
            .GroupBy(z => 1)
            .Select(g => new
            {
                Total = g.Count(),
                TotalAmount = g.Sum(z => z.Betrag)
            })
            .FirstOrDefaultAsync(cancellationToken);

        // Get member count for ARPU calculation
        var memberCount = await _context.Mitglieder
            .Where(m => m.DeletedFlag != true && m.Aktiv == true)
            .Where(m => !vereinId.HasValue || m.VereinId == vereinId.Value)
            .CountAsync(cancellationToken);

        // Get active members count (members with at least one Forderung)
        var activeMitgliederCount = await forderungenQuery
            .Select(f => f.MitgliedId)
            .Distinct()
            .CountAsync(cancellationToken);

        // Calculate average payment days (Faelligkeit vs actual payment date)
        var avgPaymentDays = await _context.MitgliedForderungZahlungen
            .Where(fz => fz.DeletedFlag != true)
            .Where(fz => !vereinId.HasValue || fz.Zahlung!.VereinId == vereinId.Value)
            .Where(fz => fz.Forderung!.StatusId == 1) // Only paid Forderungen
            .Select(fz => new
            {
                Faelligkeit = fz.Forderung!.Faelligkeit,
                ZahlungsDatum = fz.Zahlung!.Zahlungsdatum
            })
            .ToListAsync(cancellationToken);

        var avgDays = avgPaymentDays.Any()
            ? avgPaymentDays.Average(x => (x.ZahlungsDatum - x.Faelligkeit).TotalDays)
            : 0;

        // Calculate collection rate
        var collectionRate = forderungenStats?.TotalAmount > 0
            ? (forderungenStats.BezahltAmount / forderungenStats.TotalAmount) * 100
            : 0;

        // Calculate ARPU
        var arpu = memberCount > 0 && zahlungenStats != null
            ? zahlungenStats.TotalAmount / memberCount
            : 0;

        // Get monthly trend (last 12 months)
        var monthlyTrend = await GetMonthlyTrendAsync(vereinId, true, cancellationToken);

        // Get payment methods distribution (reuse existing zahlungenQuery)
        var paymentMethods = await zahlungenQuery
            .GroupBy(z => z.Zahlungsweg ?? "Unbekannt")
            .Select(g => new PaymentMethodDto
            {
                Method = g.Key,
                Count = g.Count(),
                Amount = g.Sum(z => z.Betrag)
            })
            .OrderByDescending(pm => pm.Amount)
            .ToListAsync(cancellationToken);

        return new GelirStatsDto
        {
            TotalForderungen = forderungenStats?.Total ?? 0,
            BezahlteForderungen = forderungenStats?.Bezahlt ?? 0,
            OffeneForderungen = forderungenStats?.Offen ?? 0,
            UeberfaelligeForderungen = forderungenStats?.Ueberfaellig ?? 0,
            TotalAmount = forderungenStats?.TotalAmount ?? 0,
            BezahltAmount = forderungenStats?.BezahltAmount ?? 0,
            OffenAmount = forderungenStats?.OffenAmount ?? 0,
            UeberfaelligAmount = forderungenStats?.UeberfaelligAmount ?? 0,
            CollectionRate = collectionRate,
            ExpectedRevenue = forderungenStats?.TotalAmount ?? 0,
            Arpu = arpu,
            AvgPaymentDays = (decimal)avgDays,
            ActiveMitglieder = activeMitgliederCount,
            TotalZahlungen = zahlungenStats?.Total ?? 0,
            TotalZahlungenAmount = zahlungenStats?.TotalAmount ?? 0,
            MonthlyTrend = monthlyTrend,
            PaymentMethods = paymentMethods
        };
    }

    /// <summary>
    /// Get expense (Gider) statistics
    /// </summary>
    private async Task<GiderStatsDto> GetGiderStatsAsync(int? vereinId, CancellationToken cancellationToken)
    {
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        // Base query for DITIB Zahlungen
        var ditibQuery = _context.VereinDitibZahlungen
            .Where(d => d.DeletedFlag != true);

        if (vereinId.HasValue)
        {
            ditibQuery = ditibQuery.Where(d => d.VereinId == vereinId.Value);
        }

        // Aggregate DITIB statistics
        var ditibStats = await ditibQuery
            .GroupBy(d => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Bezahlt = g.Count(d => d.StatusId == 1),
                Offen = g.Count(d => d.StatusId == 2),
                TotalAmount = g.Sum(d => d.Betrag),
                BezahltAmount = g.Where(d => d.StatusId == 1).Sum(d => d.Betrag),
                OffenAmount = g.Where(d => d.StatusId == 2).Sum(d => d.Betrag),
                CurrentMonthAmount = g.Where(d => d.Zahlungsdatum.Month == currentMonth && d.Zahlungsdatum.Year == currentYear).Sum(d => d.Betrag)
            })
            .FirstOrDefaultAsync(cancellationToken);

        // Get monthly trend (last 12 months)
        var monthlyTrend = await GetMonthlyTrendAsync(vereinId, false, cancellationToken);

        return new GiderStatsDto
        {
            TotalDitibZahlungen = ditibStats?.Total ?? 0,
            BezahlteDitibZahlungen = ditibStats?.Bezahlt ?? 0,
            OffeneDitibZahlungen = ditibStats?.Offen ?? 0,
            TotalAmount = ditibStats?.TotalAmount ?? 0,
            BezahltAmount = ditibStats?.BezahltAmount ?? 0,
            OffenAmount = ditibStats?.OffenAmount ?? 0,
            CurrentMonthAmount = ditibStats?.CurrentMonthAmount ?? 0,
            MonthlyTrend = monthlyTrend
        };
    }

    /// <summary>
    /// Get monthly trend data (last 12 months)
    /// </summary>
    private async Task<List<MonthlyTrendDto>> GetMonthlyTrendAsync(
        int? vereinId,
        bool isIncome,
        CancellationToken cancellationToken)
    {
        var startDate = DateTime.UtcNow.AddMonths(-11).Date;
        startDate = new DateTime(startDate.Year, startDate.Month, 1);

        if (isIncome)
        {
            // Income trend from MitgliedZahlungen
            var query = _context.MitgliedZahlungen
                .Where(z => z.DeletedFlag != true && z.Zahlungsdatum >= startDate);

            if (vereinId.HasValue)
            {
                query = query.Where(z => z.VereinId == vereinId.Value);
            }

            var trend = await query
                .GroupBy(z => new { z.Zahlungsdatum.Year, z.Zahlungsdatum.Month })
                .Select(g => new MonthlyTrendDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Amount = g.Sum(z => z.Betrag),
                    Count = g.Count()
                })
                .OrderBy(t => t.Year)
                .ThenBy(t => t.Month)
                .ToListAsync(cancellationToken);

            // Fill in missing months with zero
            return FillMissingMonths(trend, startDate);
        }
        else
        {
            // Expense trend from VereinDitibZahlungen
            var query = _context.VereinDitibZahlungen
                .Where(d => d.DeletedFlag != true && d.Zahlungsdatum >= startDate);

            if (vereinId.HasValue)
            {
                query = query.Where(d => d.VereinId == vereinId.Value);
            }

            var trend = await query
                .GroupBy(d => new { d.Zahlungsdatum.Year, d.Zahlungsdatum.Month })
                .Select(g => new MonthlyTrendDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Amount = g.Sum(d => d.Betrag),
                    Count = g.Count()
                })
                .OrderBy(t => t.Year)
                .ThenBy(t => t.Month)
                .ToListAsync(cancellationToken);

            return FillMissingMonths(trend, startDate);
        }
    }

    /// <summary>
    /// Fill missing months with zero values
    /// </summary>
    private List<MonthlyTrendDto> FillMissingMonths(List<MonthlyTrendDto> trend, DateTime startDate)
    {
        var result = new List<MonthlyTrendDto>();
        var monthNames = new[] { "", "Januar", "Februar", "März", "April", "Mai", "Juni",
                                "Juli", "August", "September", "Oktober", "November", "Dezember" };

        for (int i = 0; i < 12; i++)
        {
            var date = startDate.AddMonths(i);
            var existing = trend.FirstOrDefault(t => t.Year == date.Year && t.Month == date.Month);

            result.Add(new MonthlyTrendDto
            {
                Year = date.Year,
                Month = date.Month,
                MonthName = monthNames[date.Month],
                Amount = existing?.Amount ?? 0,
                Count = existing?.Count ?? 0
            });
        }

        return result;
    }

    /// <summary>
    /// Get Verein comparison data (Admin only)
    /// </summary>
    private async Task<List<VereinComparisonDto>> GetVereinComparisonAsync(CancellationToken cancellationToken)
    {
        var vereine = await _context.Vereine
            .Where(v => v.DeletedFlag != true && v.Aktiv == true)
            .Select(v => new
            {
                v.Id,
                v.Name
            })
            .ToListAsync(cancellationToken);

        var comparison = new List<VereinComparisonDto>();

        foreach (var verein in vereine)
        {
            // Get revenue (from MitgliedZahlungen)
            var revenue = await _context.MitgliedZahlungen
                .Where(z => z.VereinId == verein.Id && z.DeletedFlag != true)
                .SumAsync(z => z.Betrag, cancellationToken);

            // Get expenses (from VereinDitibZahlungen)
            var expenses = await _context.VereinDitibZahlungen
                .Where(d => d.VereinId == verein.Id && d.DeletedFlag != true && d.StatusId == 1)
                .SumAsync(d => d.Betrag, cancellationToken);

            // Get collection rate
            var totalForderungen = await _context.MitgliedForderungen
                .Where(f => f.VereinId == verein.Id && f.DeletedFlag != true)
                .SumAsync(f => f.Betrag, cancellationToken);

            var bezahltForderungen = await _context.MitgliedForderungen
                .Where(f => f.VereinId == verein.Id && f.DeletedFlag != true && f.StatusId == 1)
                .SumAsync(f => f.Betrag, cancellationToken);

            var collectionRate = totalForderungen > 0 ? (bezahltForderungen / totalForderungen) * 100 : 0;

            // Get member count
            var memberCount = await _context.Mitglieder
                .Where(m => m.VereinId == verein.Id && m.DeletedFlag != true && m.Aktiv == true)
                .CountAsync(cancellationToken);

            comparison.Add(new VereinComparisonDto
            {
                VereinId = verein.Id,
                VereinName = verein.Name,
                Revenue = revenue,
                Expenses = expenses,
                CollectionRate = collectionRate,
                MemberCount = memberCount
            });
        }

        return comparison.OrderByDescending(c => c.Revenue).ToList();
    }
}


