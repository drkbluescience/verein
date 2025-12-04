using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderung;

/// <summary>
/// Data Transfer Object for member financial summary
/// </summary>
public class MitgliedFinanzSummaryDto
{
    /// <summary>
    /// Current balance (total unpaid claims)
    /// </summary>
    [JsonPropertyName("currentBalance")]
    public decimal CurrentBalance { get; set; }

    /// <summary>
    /// Total amount paid (all time)
    /// </summary>
    [JsonPropertyName("totalPaid")]
    public decimal TotalPaid { get; set; }

    /// <summary>
    /// Total overdue amount
    /// </summary>
    [JsonPropertyName("totalOverdue")]
    public decimal TotalOverdue { get; set; }

    /// <summary>
    /// Number of overdue claims
    /// </summary>
    [JsonPropertyName("overdueCount")]
    public int OverdueCount { get; set; }

    /// <summary>
    /// Total debt (all unpaid claims)
    /// </summary>
    [JsonPropertyName("totalDebt")]
    public decimal TotalDebt { get; set; }

    /// <summary>
    /// Credit balance (advance payments / Vorauszahlung)
    /// </summary>
    [JsonPropertyName("creditBalance")]
    public decimal CreditBalance { get; set; }

    /// <summary>
    /// Next payment due (null if no unpaid claims)
    /// </summary>
    [JsonPropertyName("nextPayment")]
    public MitgliedForderungDto? NextPayment { get; set; }

    /// <summary>
    /// Days until next payment (negative if overdue)
    /// </summary>
    [JsonPropertyName("daysUntilNextPayment")]
    public int DaysUntilNextPayment { get; set; }

    /// <summary>
    /// Payment trend for the last 12 months
    /// </summary>
    [JsonPropertyName("last12MonthsTrend")]
    public List<MonthlyTrendDto> Last12MonthsTrend { get; set; } = new();

    /// <summary>
    /// List of unpaid claims
    /// </summary>
    [JsonPropertyName("unpaidClaims")]
    public List<MitgliedForderungDto> UnpaidClaims { get; set; } = new();

    /// <summary>
    /// List of paid claims
    /// </summary>
    [JsonPropertyName("paidClaims")]
    public List<MitgliedForderungDto> PaidClaims { get; set; } = new();

    /// <summary>
    /// Upcoming payments for next 3 months (estimated based on membership fee)
    /// </summary>
    [JsonPropertyName("upcomingPayments")]
    public List<UpcomingPaymentDto> UpcomingPayments { get; set; } = new();

    /// <summary>
    /// Yearly statistics
    /// </summary>
    [JsonPropertyName("yearlyStats")]
    public YearlyStatsDto? YearlyStats { get; set; }

    /// <summary>
    /// Membership fee plan (Beitrag plan from Mitglied table)
    /// </summary>
    [JsonPropertyName("beitragPlan")]
    public BeitragPlanDto? BeitragPlan { get; set; }

    /// <summary>
    /// Event registrations for this member
    /// </summary>
    [JsonPropertyName("veranstaltungAnmeldungen")]
    public List<MitgliedVeranstaltungDto> VeranstaltungAnmeldungen { get; set; } = new();

    /// <summary>
    /// Unpaid event claims (events with pending payment)
    /// </summary>
    [JsonPropertyName("unpaidEventClaims")]
    public List<MitgliedVeranstaltungDto> UnpaidEventClaims { get; set; } = new();
}

/// <summary>
/// DTO for upcoming/estimated payments
/// </summary>
public class UpcomingPaymentDto
{
    [JsonPropertyName("dueDate")]
    public DateTime DueDate { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    [JsonPropertyName("daysUntil")]
    public int DaysUntil { get; set; }

    [JsonPropertyName("isExisting")]
    public bool IsExisting { get; set; }

    [JsonPropertyName("forderungId")]
    public int? ForderungId { get; set; }
}

/// <summary>
/// DTO for yearly statistics
/// </summary>
public class YearlyStatsDto
{
    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("totalPayments")]
    public int TotalPayments { get; set; }

    [JsonPropertyName("totalAmount")]
    public decimal TotalAmount { get; set; }

    [JsonPropertyName("averagePaymentDays")]
    public double AveragePaymentDays { get; set; }

    [JsonPropertyName("preferredPaymentMethod")]
    public string? PreferredPaymentMethod { get; set; }

    [JsonPropertyName("preferredMethodPercentage")]
    public double PreferredMethodPercentage { get; set; }
}

/// <summary>
/// DTO for membership fee plan (Beitrag)
/// </summary>
public class BeitragPlanDto
{
    /// <summary>
    /// Monthly/Yearly fee amount
    /// </summary>
    [JsonPropertyName("betrag")]
    public decimal Betrag { get; set; }

    /// <summary>
    /// Currency ID
    /// </summary>
    [JsonPropertyName("waehrungId")]
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Currency code (EUR, TRY, etc.)
    /// </summary>
    [JsonPropertyName("waehrungCode")]
    public string? WaehrungCode { get; set; }

    /// <summary>
    /// Payment period code (MONTHLY, YEARLY, QUARTERLY)
    /// </summary>
    [JsonPropertyName("periodeCode")]
    public string? PeriodeCode { get; set; }

    /// <summary>
    /// Payment period name (translated)
    /// </summary>
    [JsonPropertyName("periodeName")]
    public string? PeriodeName { get; set; }

    /// <summary>
    /// Payment day of month (1-31)
    /// </summary>
    [JsonPropertyName("zahlungsTag")]
    public int? ZahlungsTag { get; set; }

    /// <summary>
    /// Payment day type code (FIRST_DAY, LAST_DAY, SPECIFIC_DAY)
    /// </summary>
    [JsonPropertyName("zahlungstagTypCode")]
    public string? ZahlungstagTypCode { get; set; }

    /// <summary>
    /// Payment day type name (translated)
    /// </summary>
    [JsonPropertyName("zahlungstagTypName")]
    public string? ZahlungstagTypName { get; set; }

    /// <summary>
    /// Is fee mandatory?
    /// </summary>
    [JsonPropertyName("istPflicht")]
    public bool IstPflicht { get; set; }

    /// <summary>
    /// Next payment dates (calculated for next 6 months)
    /// </summary>
    [JsonPropertyName("nextPaymentDates")]
    public List<BeitragPaymentDateDto> NextPaymentDates { get; set; } = new();
}

/// <summary>
/// DTO for upcoming fee payment date
/// </summary>
public class BeitragPaymentDateDto
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("month")]
    public int Month { get; set; }

    [JsonPropertyName("year")]
    public int Year { get; set; }

    [JsonPropertyName("monthName")]
    public string MonthName { get; set; } = string.Empty;

    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    /// <summary>
    /// Status: PAID, UNPAID, OVERDUE
    /// </summary>
    [JsonPropertyName("status")]
    public string Status { get; set; } = "UNPAID";

    /// <summary>
    /// Related Forderung ID if exists
    /// </summary>
    [JsonPropertyName("forderungId")]
    public int? ForderungId { get; set; }
}

/// <summary>
/// DTO for member's event registration (simplified for finanz view)
/// </summary>
public class MitgliedVeranstaltungDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("veranstaltungId")]
    public int VeranstaltungId { get; set; }

    [JsonPropertyName("titel")]
    public string Titel { get; set; } = string.Empty;

    [JsonPropertyName("startdatum")]
    public DateTime Startdatum { get; set; }

    [JsonPropertyName("enddatum")]
    public DateTime? Enddatum { get; set; }

    [JsonPropertyName("ort")]
    public string? Ort { get; set; }

    [JsonPropertyName("preis")]
    public decimal? Preis { get; set; }

    [JsonPropertyName("waehrungId")]
    public int? WaehrungId { get; set; }

    /// <summary>
    /// Registration status (Confirmed, Pending, Cancelled)
    /// </summary>
    [JsonPropertyName("anmeldungStatus")]
    public string? AnmeldungStatus { get; set; }

    /// <summary>
    /// Payment status ID
    /// </summary>
    [JsonPropertyName("zahlungStatusId")]
    public int? ZahlungStatusId { get; set; }

    /// <summary>
    /// Payment status text
    /// </summary>
    [JsonPropertyName("zahlungStatus")]
    public string? ZahlungStatus { get; set; }

    /// <summary>
    /// Registration date
    /// </summary>
    [JsonPropertyName("anmeldungDatum")]
    public DateTime? AnmeldungDatum { get; set; }
}

