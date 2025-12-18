using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.MitgliedForderung;
using VereinsApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace VereinsApi.Services;

/// <summary>
/// Service implementation for MitgliedForderung business operations
/// </summary>
public class MitgliedForderungService : IMitgliedForderungService
{
    private readonly IMitgliedForderungRepository _repository;
    private readonly IMitgliedZahlungRepository _zahlungRepository;
    private readonly IMitgliedRepository _mitgliedRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedForderungService> _logger;

    public MitgliedForderungService(
        IMitgliedForderungRepository repository,
        IMitgliedZahlungRepository zahlungRepository,
        IMitgliedRepository mitgliedRepository,
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<MitgliedForderungService> logger)
    {
        _repository = repository;
        _zahlungRepository = zahlungRepository;
        _mitgliedRepository = mitgliedRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    #region CRUD Operations

    public async Task<MitgliedForderungDto> CreateAsync(CreateMitgliedForderungDto createDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating new forderung for mitglied {MitgliedId}", createDto.MitgliedId);

        try
        {
            var forderung = _mapper.Map<MitgliedForderung>(createDto);
            forderung.Created = DateTime.UtcNow;
            forderung.CreatedBy = 1; // TODO: Get from current user context

            var created = await _repository.AddAsync(forderung, cancellationToken);
            
            _logger.LogInformation("Successfully created forderung with ID {ForderungId}", created.Id);
            
            return _mapper.Map<MitgliedForderungDto>(created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating forderung for mitglied {MitgliedId}", createDto.MitgliedId);
            throw;
        }
    }

    public async Task<MitgliedForderungDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderung by ID {ForderungId}", id);

        var forderung = await _repository.GetByIdAsync(id, false, cancellationToken);
        return forderung != null ? _mapper.Map<MitgliedForderungDto>(forderung) : null;
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetAllAsync(bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting all forderungen, includeDeleted: {IncludeDeleted}", includeDeleted);

        var forderungen = await _repository.GetAllAsync(includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<MitgliedForderungDto> UpdateAsync(int id, UpdateMitgliedForderungDto updateDto, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Updating forderung with ID {ForderungId}", id);

        try
        {
            var existing = await _repository.GetByIdAsync(id, false, cancellationToken);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Forderung with ID {id} not found");
            }

            _mapper.Map(updateDto, existing);
            existing.Modified = DateTime.UtcNow;
            existing.ModifiedBy = 1; // TODO: Get from current user context

            await _repository.UpdateAsync(existing, cancellationToken);
            
            _logger.LogInformation("Successfully updated forderung with ID {ForderungId}", id);
            
            return _mapper.Map<MitgliedForderungDto>(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating forderung with ID {ForderungId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting forderung with ID {ForderungId}", id);

        try
        {
            await _repository.DeleteAsync(id, cancellationToken);
            _logger.LogInformation("Successfully deleted forderung with ID {ForderungId}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting forderung with ID {ForderungId}", id);
            throw;
        }
    }

    #endregion

    #region Business Operations

    public async Task<IEnumerable<MitgliedForderungDto>> GetByMitgliedIdAsync(int mitgliedId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for mitglied {MitgliedId}", mitgliedId);

        var forderungen = await _repository.GetByMitgliedIdAsync(mitgliedId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByVereinIdAsync(int vereinId, bool includeDeleted = false, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for verein {VereinId}", vereinId);

        var forderungen = await _repository.GetByVereinIdAsync(vereinId, includeDeleted, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetUnpaidAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting unpaid forderungen for verein {VereinId}", vereinId);

        var forderungen = await _repository.GetUnpaidAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetOverdueAsync(int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting overdue forderungen for verein {VereinId}", vereinId);

        var forderungen = await _repository.GetOverdueAsync(vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByJahrAsync(int jahr, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for jahr {Jahr}, verein {VereinId}", jahr, vereinId);

        var forderungen = await _repository.GetByJahrAsync(jahr, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByJahrMonatAsync(int jahr, int monat, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen for jahr {Jahr}, monat {Monat}, verein {VereinId}", jahr, monat, vereinId);

        var forderungen = await _repository.GetByJahrMonatAsync(jahr, monat, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<IEnumerable<MitgliedForderungDto>> GetByDueDateRangeAsync(DateTime fromDate, DateTime toDate, int? vereinId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderungen from {FromDate} to {ToDate}, verein {VereinId}", fromDate, toDate, vereinId);

        var forderungen = await _repository.GetByDueDateRangeAsync(fromDate, toDate, vereinId, cancellationToken);
        return _mapper.Map<IEnumerable<MitgliedForderungDto>>(forderungen);
    }

    public async Task<MitgliedForderungDto?> GetByForderungsnummerAsync(string forderungsnummer, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting forderung by nummer {Forderungsnummer}", forderungsnummer);

        var forderung = await _repository.GetByForderungsnummerAsync(forderungsnummer, cancellationToken);
        return forderung != null ? _mapper.Map<MitgliedForderungDto>(forderung) : null;
    }

    public async Task<decimal> GetTotalUnpaidAmountAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total unpaid amount for mitglied {MitgliedId}", mitgliedId);

        return await _repository.GetTotalUnpaidAmountAsync(mitgliedId, cancellationToken);
    }

    public async Task<decimal> GetTotalUnpaidAmountByVereinAsync(int vereinId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Getting total unpaid amount for verein {VereinId}", vereinId);

        return await _repository.GetTotalUnpaidAmountByVereinAsync(vereinId, cancellationToken);
    }

    public async Task<MitgliedFinanzSummaryDto> GetMitgliedFinanzSummaryAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting financial summary for mitglied {MitgliedId}", mitgliedId);

        try
        {
            // Get all forderungen for the member
            var forderungen = await _repository.GetByMitgliedIdAsync(mitgliedId, false, cancellationToken);
            var forderungenList = forderungen.ToList();

            // Get all zahlungen for the member (membership payments)
            var zahlungen = await _zahlungRepository.GetByMitgliedIdAsync(mitgliedId, false, cancellationToken);
            var zahlungenList = zahlungen.ToList();

            // Get all event payments for the member (VeranstaltungZahlung)
            var eventZahlungen = await _context.VeranstaltungZahlungen
                .Include(z => z.Anmeldung)
                .Where(z => z.Anmeldung != null && z.Anmeldung.MitgliedId == mitgliedId && z.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            // Separate paid and unpaid claims
            var unpaidForderungen = forderungenList.Where(f => f.StatusId == 2).ToList();
            var paidForderungen = forderungenList.Where(f => f.StatusId == 1).ToList();

            // Calculate overdue claims
            var today = DateTime.UtcNow.Date;
            var overdueForderungen = unpaidForderungen.Where(f => f.Faelligkeit.Date < today).ToList();

            // Find next payment
            var nextPayment = unpaidForderungen
                .OrderBy(f => f.Faelligkeit)
                .FirstOrDefault();

            var daysUntilNextPayment = nextPayment != null
                ? (int)(nextPayment.Faelligkeit.Date - today).TotalDays
                : 0;

            // Calculate last 12 months trend (including event payments)
            var last12MonthsTrend = new List<MonthlyTrendDto>();
            for (int i = 11; i >= 0; i--)
            {
                var month = DateTime.UtcNow.AddMonths(-i);
                var monthStart = new DateTime(month.Year, month.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                // Membership payments
                var monthMitgliedZahlungen = zahlungenList
                    .Where(z => z.Zahlungsdatum.Date >= monthStart && z.Zahlungsdatum.Date <= monthEnd)
                    .ToList();

                // Event payments
                var monthEventZahlungen = eventZahlungen
                    .Where(z => z.Zahlungsdatum.Date >= monthStart && z.Zahlungsdatum.Date <= monthEnd)
                    .ToList();

                last12MonthsTrend.Add(new MonthlyTrendDto
                {
                    Month = month.Month,
                    Year = month.Year,
                    MonthName = month.ToString("MMM yy"),
                    Amount = monthMitgliedZahlungen.Sum(z => z.Betrag) + monthEventZahlungen.Sum(z => z.Betrag),
                    Count = monthMitgliedZahlungen.Count + monthEventZahlungen.Count
                });
            }

            // Calculate totals correctly (including partial payments)
            var unpaidForderungenIds = unpaidForderungen.Select(f => f.Id).ToList();
            var overdueForderungenIds = overdueForderungen.Select(f => f.Id).ToList();

            // Get partial payments for unpaid forderungen from MitgliedForderungZahlung
            var partialPaymentsForUnpaid = await _context.MitgliedForderungZahlungen
                .Where(fz => fz.DeletedFlag != true && unpaidForderungenIds.Contains(fz.ForderungId))
                .SumAsync(fz => fz.Betrag, cancellationToken);

            // Get partial payments for overdue forderungen
            var partialPaymentsForOverdue = await _context.MitgliedForderungZahlungen
                .Where(fz => fz.DeletedFlag != true && overdueForderungenIds.Contains(fz.ForderungId))
                .SumAsync(fz => fz.Betrag, cancellationToken);

            // Remaining debt = Original debt - Partial payments
            var totalDebt = unpaidForderungen.Sum(f => f.Betrag) - partialPaymentsForUnpaid;
            var totalOverdue = overdueForderungen.Sum(f => f.Betrag) - partialPaymentsForOverdue;
            // Total paid includes both membership and event payments
            var totalPaid = zahlungenList.Sum(z => z.Betrag) + eventZahlungen.Sum(z => z.Betrag);
            var currentBalance = totalDebt;

            // Get credit balance (Vorauszahlung)
            var creditBalance = await _context.MitgliedVorauszahlungen
                .Where(v => v.MitgliedId == mitgliedId && v.DeletedFlag != true)
                .SumAsync(v => v.Betrag, cancellationToken);

            // Calculate yearly stats (including event payments)
            var currentYear = DateTime.UtcNow.Year;
            var yearlyStats = await CalculateYearlyStatsAsync(mitgliedId, currentYear, zahlungenList, eventZahlungen, paidForderungen, cancellationToken);

            // Calculate upcoming payments (next 3 months)
            var upcomingPayments = CalculateUpcomingPayments(unpaidForderungen, today);

            // Get Beitrag plan from Mitglied
            var beitragPlan = await CalculateBeitragPlanAsync(mitgliedId, forderungenList, today, cancellationToken);

            // Get Veranstaltung Anmeldungen
            var veranstaltungAnmeldungen = await GetMitgliedVeranstaltungenAsync(mitgliedId, cancellationToken);

            // Get all partial payments for all forderungen at once (more efficient)
            var allForderungIds = forderungenList.Select(f => f.Id).ToList();
            var partialPaymentsByForderung = await _context.MitgliedForderungZahlungen
                .Where(fz => fz.DeletedFlag != true && allForderungIds.Contains(fz.ForderungId))
                .GroupBy(fz => fz.ForderungId)
                .Select(g => new { ForderungId = g.Key, TotalPaid = g.Sum(fz => fz.Betrag) })
                .ToDictionaryAsync(x => x.ForderungId, x => x.TotalPaid, cancellationToken);

            // Map unpaid claims with partial payment info
            var unpaidClaimsDtos = _mapper.Map<List<MitgliedForderungDto>>(unpaidForderungen.OrderBy(f => f.Faelligkeit));
            foreach (var dto in unpaidClaimsDtos)
            {
                dto.PaidAmount = partialPaymentsByForderung.GetValueOrDefault(dto.Id, 0);
                dto.RemainingAmount = dto.Betrag - dto.PaidAmount;
            }

            // Map paid claims with partial payment info
            var paidClaimsDtos = _mapper.Map<List<MitgliedForderungDto>>(paidForderungen.OrderByDescending(f => f.BezahltAm));
            foreach (var dto in paidClaimsDtos)
            {
                dto.PaidAmount = partialPaymentsByForderung.GetValueOrDefault(dto.Id, 0);
                dto.RemainingAmount = dto.Betrag - dto.PaidAmount;
            }

            // Map NextPayment with partial payment info
            MitgliedForderungDto? nextPaymentDto = null;
            if (nextPayment != null)
            {
                nextPaymentDto = _mapper.Map<MitgliedForderungDto>(nextPayment);
                nextPaymentDto.PaidAmount = partialPaymentsByForderung.GetValueOrDefault(nextPaymentDto.Id, 0);
                nextPaymentDto.RemainingAmount = nextPaymentDto.Betrag - nextPaymentDto.PaidAmount;
            }

            // Get unpaid event claims (events with pending payment - ZahlungStatus != PAID and price > 0)
            var unpaidEventClaims = veranstaltungAnmeldungen
                .Where(e => e.ZahlungStatus != "PAID" && e.Preis > 0)
                .ToList();

            // Build summary DTO
            var summary = new MitgliedFinanzSummaryDto
            {
                CurrentBalance = currentBalance,
                TotalPaid = totalPaid,
                TotalOverdue = totalOverdue,
                OverdueCount = overdueForderungen.Count,
                TotalDebt = totalDebt,
                CreditBalance = creditBalance,
                NextPayment = nextPaymentDto,
                DaysUntilNextPayment = daysUntilNextPayment,
                Last12MonthsTrend = last12MonthsTrend,
                UnpaidClaims = unpaidClaimsDtos,
                PaidClaims = paidClaimsDtos,
                UpcomingPayments = upcomingPayments,
                YearlyStats = yearlyStats,
                BeitragPlan = beitragPlan,
                VeranstaltungAnmeldungen = veranstaltungAnmeldungen,
                UnpaidEventClaims = unpaidEventClaims
            };

            _logger.LogInformation("Successfully retrieved financial summary for mitglied {MitgliedId}", mitgliedId);
            return summary;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting financial summary for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    private async Task<YearlyStatsDto> CalculateYearlyStatsAsync(
        int mitgliedId,
        int year,
        List<MitgliedZahlung> allMitgliedZahlungen,
        List<VeranstaltungZahlung> allEventZahlungen,
        List<MitgliedForderung> paidForderungen,
        CancellationToken cancellationToken)
    {
        var yearStart = new DateTime(year, 1, 1);
        var yearEnd = new DateTime(year, 12, 31);

        // Membership payments this year
        var yearMitgliedZahlungen = allMitgliedZahlungen
            .Where(z => z.Zahlungsdatum.Date >= yearStart && z.Zahlungsdatum.Date <= yearEnd)
            .ToList();

        // Event payments this year
        var yearEventZahlungen = allEventZahlungen
            .Where(z => z.Zahlungsdatum.Date >= yearStart && z.Zahlungsdatum.Date <= yearEnd)
            .ToList();

        // Total payments count and amount (both membership and event)
        var totalPaymentsCount = yearMitgliedZahlungen.Count + yearEventZahlungen.Count;
        var totalAmount = yearMitgliedZahlungen.Sum(z => z.Betrag) + yearEventZahlungen.Sum(z => z.Betrag);

        // Calculate average payment days (from due date to payment date) - only for membership claims
        var paidThisYear = paidForderungen
            .Where(f => f.BezahltAm.HasValue && f.BezahltAm.Value.Year == year)
            .ToList();

        double avgPaymentDays = 0;
        if (paidThisYear.Any())
        {
            avgPaymentDays = paidThisYear
                .Where(f => f.BezahltAm.HasValue)
                .Average(f => (f.BezahltAm!.Value.Date - f.Faelligkeit.Date).TotalDays);
        }

        // Find preferred payment method (Zahlungsweg - e.g., UEBERWEISUNG, BAR)
        // Combine both membership and event payment methods
        var allPaymentMethods = yearMitgliedZahlungen
            .Where(z => !string.IsNullOrEmpty(z.Zahlungsweg))
            .Select(z => z.Zahlungsweg!)
            .Concat(yearEventZahlungen
                .Where(z => !string.IsNullOrEmpty(z.Zahlungsweg))
                .Select(z => z.Zahlungsweg!))
            .ToList();

        var paymentMethodGroups = allPaymentMethods
            .GroupBy(m => m)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();

        string? preferredMethod = null;
        double preferredMethodPercentage = 0;

        if (paymentMethodGroups != null && allPaymentMethods.Any())
        {
            // Return the payment method code (e.g., UEBERWEISUNG, BAR)
            // Frontend will handle translation
            preferredMethod = paymentMethodGroups.Key;
            preferredMethodPercentage = (double)paymentMethodGroups.Count() / allPaymentMethods.Count * 100;
        }

        return new YearlyStatsDto
        {
            Year = year,
            TotalPayments = totalPaymentsCount,
            TotalAmount = totalAmount,
            AveragePaymentDays = Math.Round(avgPaymentDays, 1),
            PreferredPaymentMethod = preferredMethod,
            PreferredMethodPercentage = Math.Round(preferredMethodPercentage, 1)
        };
    }

    private List<UpcomingPaymentDto> CalculateUpcomingPayments(List<MitgliedForderung> unpaidForderungen, DateTime today)
    {
        var upcomingPayments = new List<UpcomingPaymentDto>();
        var threeMonthsLater = today.AddMonths(3);

        // Add existing unpaid forderungen that are due in the next 3 months
        var upcomingExisting = unpaidForderungen
            .Where(f => f.Faelligkeit.Date >= today && f.Faelligkeit.Date <= threeMonthsLater)
            .OrderBy(f => f.Faelligkeit)
            .Take(6)
            .ToList();

        foreach (var forderung in upcomingExisting)
        {
            upcomingPayments.Add(new UpcomingPaymentDto
            {
                DueDate = forderung.Faelligkeit,
                Description = forderung.Beschreibung ?? $"{forderung.Jahr}/{forderung.Monat:D2}",
                Amount = forderung.Betrag,
                DaysUntil = (int)(forderung.Faelligkeit.Date - today).TotalDays,
                IsExisting = true,
                ForderungId = forderung.Id
            });
        }

        return upcomingPayments;
    }

    private async Task<BeitragPlanDto?> CalculateBeitragPlanAsync(
        int mitgliedId,
        List<MitgliedForderung> allForderungen,
        DateTime today,
        CancellationToken cancellationToken)
    {
        var mitglied = await _mitgliedRepository.GetByIdAsync(mitgliedId, false, cancellationToken);
        if (mitglied == null || !mitglied.BeitragBetrag.HasValue || mitglied.BeitragBetrag.Value == 0)
        {
            return null;
        }

        var beitragPlan = new BeitragPlanDto
        {
            Betrag = mitglied.BeitragBetrag.Value,
            WaehrungId = mitglied.BeitragWaehrungId,
            PeriodeCode = mitglied.BeitragPeriodeCode,
            ZahlungsTag = mitglied.BeitragZahlungsTag,
            ZahlungstagTypCode = mitglied.BeitragZahlungstagTypCode,
            IstPflicht = mitglied.BeitragIstPflicht ?? false,
            NextPaymentDates = new List<BeitragPaymentDateDto>()
        };

        // Get Waehrung code
        if (mitglied.BeitragWaehrungId.HasValue)
        {
            var waehrung = await _context.Waehrungen
                .FirstOrDefaultAsync(w => w.Id == mitglied.BeitragWaehrungId.Value, cancellationToken);
            beitragPlan.WaehrungCode = waehrung?.Code;
        }

        // Filter only Beitrag (aidat) forderungen - ZahlungTypId = 1 (Mitgliedsbeitrag)
        var beitragForderungen = allForderungen
            .Where(f => f.ZahlungTypId == 1)
            .OrderBy(f => f.Faelligkeit)
            .ToList();

        // Calculate period in months
        var monthsPerPeriod = beitragPlan.PeriodeCode?.ToUpperInvariant() switch
        {
            "YEARLY" => 12,
            "QUARTERLY" => 3,
            _ => 1 // MONTHLY default
        };

        // Get payment day (default to 1st if not specified)
        var paymentDay = beitragPlan.ZahlungsTag ?? 1;
        if (beitragPlan.ZahlungstagTypCode == "LAST_DAY")
        {
            paymentDay = -1; // Will be calculated for each month
        }

        // Find the earliest and latest forderung dates
        var earliestForderung = beitragForderungen.FirstOrDefault();
        var latestForderung = beitragForderungen.LastOrDefault();

        // Determine start date: earliest forderung or member's entry date or today
        DateTime startDate;
        if (earliestForderung != null)
        {
            startDate = earliestForderung.Faelligkeit;
        }
        else if (mitglied.Eintrittsdatum.HasValue)
        {
            startDate = mitglied.Eintrittsdatum.Value;
        }
        else
        {
            startDate = today;
        }

        // Calculate exact number of periods to show (1 year worth)
        var periodsToShow = beitragPlan.PeriodeCode?.ToUpperInvariant() switch
        {
            "YEARLY" => 2,      // 2 years (2 periods)
            "QUARTERLY" => 4,   // 4 quarters = 1 year
            _ => 12             // 12 months = 1 year
        };

        // Generate exactly periodsToShow payment dates starting from startDate
        var currentPeriodStart = new DateTime(startDate.Year, startDate.Month, 1);
        var periodsGenerated = 0;

        while (periodsGenerated < periodsToShow)
        {
            var actualPaymentDay = paymentDay == -1
                ? DateTime.DaysInMonth(currentPeriodStart.Year, currentPeriodStart.Month)
                : Math.Min(paymentDay, DateTime.DaysInMonth(currentPeriodStart.Year, currentPeriodStart.Month));

            var paymentDate = new DateTime(currentPeriodStart.Year, currentPeriodStart.Month, actualPaymentDay);

            // Find existing forderung for this period
            var existingForderung = beitragForderungen.FirstOrDefault(f =>
            {
                if (beitragPlan.PeriodeCode?.ToUpperInvariant() == "MONTHLY")
                {
                    return f.Jahr == paymentDate.Year && f.Monat == paymentDate.Month;
                }
                else if (beitragPlan.PeriodeCode?.ToUpperInvariant() == "QUARTERLY")
                {
                    var targetQuartal = ((paymentDate.Month - 1) / 3) + 1;
                    return f.Jahr == paymentDate.Year && f.Quartal == targetQuartal;
                }
                else if (beitragPlan.PeriodeCode?.ToUpperInvariant() == "YEARLY")
                {
                    return f.Jahr == paymentDate.Year;
                }
                return false;
            });

            // Determine status
            var status = "UNPAID";
            decimal amount = beitragPlan.Betrag;

            if (existingForderung != null)
            {
                amount = existingForderung.Betrag;
                if (existingForderung.StatusId == 1) // BEZAHLT
                {
                    status = "PAID";
                }
                else if (paymentDate < today)
                {
                    status = "OVERDUE";
                }
            }
            else if (paymentDate < today)
            {
                status = "OVERDUE";
            }

            beitragPlan.NextPaymentDates.Add(new BeitragPaymentDateDto
            {
                Date = paymentDate,
                Month = paymentDate.Month,
                Year = paymentDate.Year,
                MonthName = paymentDate.ToString("MMM"),
                Amount = amount,
                Status = status,
                ForderungId = existingForderung?.Id
            });

            // Move to next period
            currentPeriodStart = currentPeriodStart.AddMonths(monthsPerPeriod);
            periodsGenerated++;
        }

        return beitragPlan;
    }

    private async Task<List<MitgliedVeranstaltungDto>> GetMitgliedVeranstaltungenAsync(
        int mitgliedId,
        CancellationToken cancellationToken)
    {
        var anmeldungen = await _context.VeranstaltungAnmeldungen
            .Include(a => a.Veranstaltung)
            .Where(a => a.MitgliedId == mitgliedId && a.DeletedFlag != true)
            .OrderByDescending(a => a.Veranstaltung!.Startdatum)
            .Take(10) // Last 10 registrations
            .ToListAsync(cancellationToken);

        var result = new List<MitgliedVeranstaltungDto>();

        foreach (var anmeldung in anmeldungen)
        {
            if (anmeldung.Veranstaltung == null) continue;

            var zahlungStatus = "UNPAID";
            if (anmeldung.ZahlungStatusId == 1)
                zahlungStatus = "PAID";
            else if (anmeldung.ZahlungStatusId == 2)
                zahlungStatus = "PENDING";

            result.Add(new MitgliedVeranstaltungDto
            {
                Id = anmeldung.Id,
                VeranstaltungId = anmeldung.VeranstaltungId,
                Titel = anmeldung.Veranstaltung.Titel,
                Startdatum = anmeldung.Veranstaltung.Startdatum,
                Enddatum = anmeldung.Veranstaltung.Enddatum,
                Ort = anmeldung.Veranstaltung.Ort,
                Preis = anmeldung.Preis ?? anmeldung.Veranstaltung.Preis,
                WaehrungId = anmeldung.WaehrungId ?? anmeldung.Veranstaltung.WaehrungId,
                AnmeldungStatus = anmeldung.Status,
                ZahlungStatusId = anmeldung.ZahlungStatusId,
                ZahlungStatus = zahlungStatus,
                AnmeldungDatum = anmeldung.Created
            });
        }

        return result;
    }

    #endregion
}

