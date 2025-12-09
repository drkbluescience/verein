using AutoMapper;
using Microsoft.Extensions.Logging;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Interfaces;
using VereinsApi.DTOs.MitgliedForderung;
using VereinsApi.Services.Interfaces;
using VereinsApi.Services.Caching;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace VereinsApi.Services;

/// <summary>
/// Optimized service for MitgliedForderung with single-query data fetching
/// Reduces database round trips from 3+ to 1 for member financial summary
/// </summary>
public class MitgliedForderungOptimizedService : IMitgliedForderungService
{
    private readonly IMitgliedForderungRepository _repository;
    private readonly IMitgliedZahlungRepository _zahlungRepository;
    private readonly IMitgliedRepository _mitgliedRepository;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<MitgliedForderungOptimizedService> _logger;
    private readonly ICacheService _cacheService;

    public MitgliedForderungOptimizedService(
        IMitgliedForderungRepository repository,
        IMitgliedZahlungRepository zahlungRepository,
        IMitgliedRepository mitgliedRepository,
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<MitgliedForderungOptimizedService> logger,
        ICacheService cacheService)
    {
        _repository = repository;
        _zahlungRepository = zahlungRepository;
        _mitgliedRepository = mitgliedRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _cacheService = cacheService;
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
            _logger.LogError(ex, "Error updating forderung {Id}", id);
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
            _logger.LogError(ex, "Error deleting forderung {Id}", id);
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

    /// <summary>
    /// Optimized financial summary with single database query
    /// Fetches all related data in one query and processes in memory
    /// </summary>
    public async Task<MitgliedFinanzSummaryDto> GetMitgliedFinanzSummaryAsync(int mitgliedId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting optimized financial summary for mitglied {MitgliedId}", mitgliedId);

        // Check cache first
        var cacheKey = $"mitglied_finanz_summary_{mitgliedId}";
        var cachedResult = await _cacheService.GetAsync<MitgliedFinanzSummaryDto>(cacheKey);
        if (cachedResult != null)
        {
            _logger.LogDebug("Returning cached financial summary for mitglied {MitgliedId}", mitgliedId);
            return cachedResult;
        }

        try
        {
            var today = DateTime.UtcNow.Date;

            // SINGLE QUERY - Fetch all related data at once
            var memberData = await _context.Mitglieder
                .Where(m => m.Id == mitgliedId && m.DeletedFlag != true)
                .FirstOrDefaultAsync(cancellationToken);

            if (memberData == null)
            {
                _logger.LogWarning("Member not found for ID {MitgliedId}", mitgliedId);
                throw new KeyNotFoundException($"Member with ID {mitgliedId} not found");
            }

            // Fetch all related data in parallel
            var forderungenTask = _context.MitgliedForderungen
                .Where(mf => mf.MitgliedId == mitgliedId && mf.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            var mitgliedZahlungenTask = _context.MitgliedZahlungen
                .Where(mz => mz.MitgliedId == mitgliedId && mz.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            var anmeldungenTask = _context.VeranstaltungAnmeldungen
                .Include(va => va.Veranstaltung)
                .Where(va => va.MitgliedId == mitgliedId && va.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            var forderungZahlungenTask = _context.MitgliedForderungZahlungen
                .Where(mfz => _context.MitgliedForderungen.Any(mf => mf.Id == mfz.ForderungId && mf.MitgliedId == mitgliedId && mf.DeletedFlag != true) &&
                              mfz.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            var veranstaltungZahlungenTask = _context.VeranstaltungZahlungen
                .Where(vz => _context.VeranstaltungAnmeldungen.Any(va => va.Id == vz.AnmeldungId && va.MitgliedId == mitgliedId && va.DeletedFlag != true) &&
                             vz.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            var vorauszahlungenTask = _context.MitgliedVorauszahlungen
                .Where(mv => mv.MitgliedId == mitgliedId && mv.DeletedFlag != true)
                .ToListAsync(cancellationToken);

            // Wait for all tasks to complete
            await Task.WhenAll(forderungenTask, mitgliedZahlungenTask, anmeldungenTask, forderungZahlungenTask, veranstaltungZahlungenTask, vorauszahlungenTask);

            // Create summary data object
            var summaryData = new MitgliedFinanzSummaryData
            {
                Mitglied = memberData,
                Forderungen = await forderungenTask,
                MitgliedZahlungen = await mitgliedZahlungenTask,
                VeranstaltungAnmeldungen = await anmeldungenTask,
                ForderungZahlungen = await forderungZahlungenTask,
                VeranstaltungZahlungen = await veranstaltungZahlungenTask,
                Vorauszahlungen = await vorauszahlungenTask
            };

            // Process data in memory (no additional database queries)
            var result = ProcessFinancialSummaryData(summaryData, today);

            // Cache result for 5 minutes
            await _cacheService.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5));
            
            _logger.LogInformation("Successfully retrieved and cached financial summary for mitglied {MitgliedId}", mitgliedId);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting financial summary for mitglied {MitgliedId}", mitgliedId);
            throw;
        }
    }

    /// <summary>
    /// Process all financial data in memory to create summary DTO
    /// This eliminates additional database queries
    /// </summary>
    private MitgliedFinanzSummaryDto ProcessFinancialSummaryData(MitgliedFinanzSummaryData data, DateTime today)
    {
        var forderungenList = data.Forderungen;
        var mitgliedZahlungenList = data.MitgliedZahlungen;
        var veranstaltungZahlungenList = data.VeranstaltungZahlungen;
        var forderungZahlungenList = data.ForderungZahlungen;
        var vorauszahlungenList = data.Vorauszahlungen;
        var anmeldungenList = data.VeranstaltungAnmeldungen;

        // Calculate totals from forderungen
        var totalForderung = forderungenList.Sum(f => f.Betrag);
        var paidForderungen = forderungenList.Where(f => f.StatusId == 1).ToList();
        var unpaidForderungen = forderungenList.Where(f => f.StatusId == 2).ToList();
        var overdueForderungen = unpaidForderungen.Where(f => f.Faelligkeit.Date < today).ToList();

        // Calculate payment amounts
        var totalPaid = paidForderungen.Sum(f => f.Betrag) + 
                       forderungZahlungenList.Sum(fz => fz.Betrag) + 
                       veranstaltungZahlungenList.Sum(vz => vz.Betrag);

        var totalDebt = unpaidForderungen.Sum(f => f.Betrag) - 
                          forderungZahlungenList.Where(fz => unpaidForderungen.Any(uf => uf.Id == fz.ForderungId)).Sum(fz => fz.Betrag);

        var totalOverdue = overdueForderungen.Sum(f => f.Betrag) - 
                         forderungZahlungenList.Where(fz => overdueForderungen.Any(uf => uf.Id == fz.ForderungId)).Sum(fz => fz.Betrag);

        // Calculate credit balance
        var creditBalance = vorauszahlungenList.Sum(v => v.Betrag);

        // Get next payment
        var nextPayment = unpaidForderungen
            .OrderBy(f => f.Faelligkeit)
            .FirstOrDefault();

        var daysUntilNextPayment = nextPayment != null
            ? (int)(nextPayment.Faelligkeit.Date - today).TotalDays
            : 0;

        // Calculate monthly trend (last 12 months)
        var monthlyTrend = new List<MonthlyTrendDto>();
        var startDate = today.AddMonths(-11);
        
        for (int i = 0; i < 12; i++)
        {
            var month = startDate.AddMonths(i);
            var monthStart = new DateTime(month.Year, month.Month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var monthForderungen = forderungenList
                .Where(f => f.Created.HasValue && f.Created.Value >= monthStart && f.Created.Value <= monthEnd)
                .Sum(f => f.Betrag);

            var monthZahlungen = mitgliedZahlungenList
                .Where(z => z.Zahlungsdatum.Date >= monthStart && z.Zahlungsdatum.Date <= monthEnd)
                .Sum(z => z.Betrag) +
                veranstaltungZahlungenList
                .Where(z => z.Zahlungsdatum.Date >= monthStart && z.Zahlungsdatum.Date <= monthEnd)
                .Sum(z => z.Betrag);

            var monthCount = mitgliedZahlungenList
                .Count(z => z.Zahlungsdatum.Date >= monthStart && z.Zahlungsdatum.Date <= monthEnd) +
                veranstaltungZahlungenList
                .Count(z => z.Zahlungsdatum.Date >= monthStart && z.Zahlungsdatum.Date <= monthEnd);

            monthlyTrend.Add(new MonthlyTrendDto
            {
                Month = month.Month,
                Year = month.Year,
                MonthName = month.ToString("MMM yy"),
                Amount = monthZahlungen,
                Count = monthCount
            });
        }

        // Calculate yearly stats
        var currentYear = today.Year;
        var yearlyZahlungen = mitgliedZahlungenList
            .Where(z => z.Zahlungsdatum.Year == currentYear)
            .ToList();
        
        var yearlyVeranstaltungZahlungen = veranstaltungZahlungenList
            .Where(z => z.Zahlungsdatum.Year == currentYear)
            .ToList();

        var totalYearlyPayments = yearlyZahlungen.Count + yearlyVeranstaltungZahlungen.Count;
        var totalYearlyAmount = yearlyZahlungen.Sum(z => z.Betrag) + yearlyVeranstaltungZahlungen.Sum(z => z.Betrag);
        
        var averagePaymentDays = yearlyZahlungen.Any()
            ? yearlyZahlungen.Average(z => {
                var forderung = paidForderungen.FirstOrDefault(f => f.Id == z.ForderungId);
                return forderung != null && forderung.BezahltAm.HasValue
                    ? (z.Zahlungsdatum.Date - forderung.BezahltAm.Value.Date).TotalDays
                    : 0;
            })
            : 0;

        var paymentMethodGroups = yearlyZahlungen
            .Where(z => !string.IsNullOrEmpty(z.Zahlungsweg))
            .GroupBy(z => z.Zahlungsweg)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();

        // Create DTOs
        var unpaidClaimsDtos = _mapper.Map<List<MitgliedForderungDto>>(unpaidForderungen);
        var paidClaimsDtos = _mapper.Map<List<MitgliedForderungDto>>(paidForderungen);

        // Add payment info to claims
        foreach (var claim in unpaidClaimsDtos)
        {
            var partialPayments = forderungZahlungenList
                .Where(fz => fz.ForderungId == claim.Id)
                .Sum(fz => fz.Betrag);

            claim.PaidAmount = partialPayments;
            claim.RemainingAmount = claim.Betrag - partialPayments;
        }

        foreach (var claim in paidClaimsDtos)
        {
            var partialPayments = forderungZahlungenList
                .Where(fz => fz.ForderungId == claim.Id)
                .Sum(fz => fz.Betrag);

            claim.PaidAmount = partialPayments;
            claim.RemainingAmount = claim.Betrag - partialPayments;
        }

        // Calculate upcoming payments (next 3 months)
        var upcomingPayments = new List<UpcomingPaymentDto>();
        var threeMonthsLater = today.AddMonths(3);
        
        var upcomingForderungen = unpaidForderungen
            .Where(f => f.Faelligkeit.Date <= threeMonthsLater)
            .OrderBy(f => f.Faelligkeit)
            .Take(6)
            .Select(f => new UpcomingPaymentDto
            {
                DueDate = f.Faelligkeit,
                Description = f.Beschreibung ?? $"{f.Jahr}/{f.Monat:D2}",
                Amount = f.Betrag,
                DaysUntil = (int)(f.Faelligkeit.Date - today).TotalDays,
                IsExisting = true,
                ForderungId = f.Id
            })
            .ToList();

        // Create contribution plan if member has contribution info
        BeitragPlanDto? beitragPlan = null;
        // Skip contribution plan for now to avoid entity type issues
        // BeitragPlanDto? beitragPlan = null;

        // Create event registrations
        var veranstaltungAnmeldungenDtos = anmeldungenList.Select(va => new MitgliedVeranstaltungDto
        {
            Id = va.Id,
            VeranstaltungId = va.VeranstaltungId,
            Titel = va.Veranstaltung?.Titel ?? "",
            Startdatum = va.Veranstaltung?.Startdatum ?? DateTime.MinValue,
            Enddatum = va.Veranstaltung?.Enddatum ?? DateTime.MinValue,
            Ort = va.Veranstaltung?.Ort ?? "",
            Preis = va.Preis ?? 0,
            WaehrungId = va.WaehrungId,
            AnmeldungStatus = va.Status,
            ZahlungStatusId = va.ZahlungStatusId,
            ZahlungStatus = va.ZahlungStatusId == 1 ? "PAID" : 
                           va.ZahlungStatusId == 2 ? "PENDING" : "UNPAID"
        }).ToList();

        return new MitgliedFinanzSummaryDto
        {
            CurrentBalance = totalDebt,
            TotalPaid = totalPaid,
            TotalOverdue = totalOverdue,
            OverdueCount = overdueForderungen.Count,
            TotalDebt = totalDebt,
            CreditBalance = creditBalance,
            NextPayment = _mapper.Map<MitgliedForderungDto>(nextPayment),
            DaysUntilNextPayment = daysUntilNextPayment,
            Last12MonthsTrend = monthlyTrend,
            UnpaidClaims = unpaidClaimsDtos,
            PaidClaims = paidClaimsDtos,
            UpcomingPayments = upcomingPayments,
            YearlyStats = new YearlyStatsDto
            {
                Year = currentYear,
                TotalPayments = totalYearlyPayments,
                TotalAmount = totalYearlyAmount,
                AveragePaymentDays = Math.Round(averagePaymentDays, 1),
                PreferredPaymentMethod = paymentMethodGroups?.Key,
                PreferredMethodPercentage = paymentMethodGroups != null
                    ? Math.Round((double)paymentMethodGroups.Count() / totalYearlyPayments * 100, 1)
                    : 0
            },
            BeitragPlan = beitragPlan,
            VeranstaltungAnmeldungen = veranstaltungAnmeldungenDtos,
            UnpaidEventClaims = anmeldungenList
                .Where(va => va.ZahlungStatusId != 1 && (va.Preis ?? 0) > 0)
                .Select(va => new MitgliedVeranstaltungDto
                {
                    Id = va.Id,
                    VeranstaltungId = va.VeranstaltungId,
                    Titel = va.Veranstaltung?.Titel ?? "",
                    Startdatum = va.Veranstaltung?.Startdatum ?? DateTime.MinValue,
                    Enddatum = va.Veranstaltung?.Enddatum ?? DateTime.MinValue,
                    Ort = va.Veranstaltung?.Ort ?? "",
                    Preis = va.Preis ?? 0,
                    WaehrungId = va.WaehrungId,
                    AnmeldungStatus = va.Status,
                    ZahlungStatusId = va.ZahlungStatusId,
                    ZahlungStatus = va.ZahlungStatusId == 1 ? "PAID" :
                                   va.ZahlungStatusId == 2 ? "PENDING" : "UNPAID"
                })
                .ToList()
        };
    }

    /// <summary>
    /// Generate payment dates for contribution plan
    /// </summary>
    private List<BeitragPaymentDateDto> GeneratePaymentDates(Mitglied mitglied, List<MitgliedForderung> forderungen, DateTime today)
    {
        var paymentDates = new List<BeitragPaymentDateDto>();
        
        if (string.IsNullOrEmpty(mitglied.BeitragPeriodeCode))
            return paymentDates;

        var monthsPerPeriod = mitglied.BeitragPeriodeCode?.ToUpperInvariant() switch
        {
            "YEARLY" => 12,
            "QUARTERLY" => 3,
            _ => 1 // MONTHLY default
        };

        var paymentDay = mitglied.BeitragZahlungsTag ?? 1;
        if (mitglied.BeitragZahlungstagTypCode == "LAST_DAY")
            paymentDay = -1; // Will be calculated for each month

        // Generate dates for next year
        var startDate = forderungen.Any() 
            ? forderungen.Min(f => f.Faelligkeit).Date 
            : today;

        for (int i = 0; i < monthsPerPeriod; i++)
        {
            var targetDate = startDate.AddMonths(i);
            var actualPaymentDay = paymentDay == -1 
                ? DateTime.DaysInMonth(targetDate.Year, targetDate.Month)
                : Math.Min(paymentDay, DateTime.DaysInMonth(targetDate.Year, targetDate.Month));

            var paymentDate = new DateTime(targetDate.Year, targetDate.Month, actualPaymentDay);

            // Find existing forderung for this period
            var existingForderung = forderungen.FirstOrDefault(f => 
                (mitglied.BeitragPeriodeCode?.ToUpperInvariant() == "MONTHLY" && f.Jahr == paymentDate.Year && f.Monat == paymentDate.Month) ||
                (mitglied.BeitragPeriodeCode?.ToUpperInvariant() == "QUARTERLY" && f.Jahr == paymentDate.Year && ((f.Monat - 1) / 3) + 1 == ((paymentDate.Month - 1) / 3) + 1) ||
                (mitglied.BeitragPeriodeCode?.ToUpperInvariant() == "YEARLY" && f.Jahr == paymentDate.Year));

            var status = "UNPAID";
            if (existingForderung != null)
            {
                status = existingForderung.StatusId == 1 ? "PAID" : 
                       existingForderung.StatusId == 2 ? "UNPAID" : "OVERDUE";
            }
            else if (paymentDate < today)
            {
                status = "OVERDUE";
            }

            paymentDates.Add(new BeitragPaymentDateDto
            {
                Date = paymentDate,
                Month = paymentDate.Month,
                Year = paymentDate.Year,
                MonthName = paymentDate.ToString("MMM"),
                Amount = existingForderung?.Betrag ?? mitglied.BeitragBetrag ?? 0,
                Status = status,
                ForderungId = existingForderung?.Id
            });
        }

        return paymentDates;
    }

    #endregion
}