using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.Finanz;

/// <summary>
/// Dashboard statistics for Finanz module
/// </summary>
public class FinanzDashboardStatsDto
{
    /// <summary>
    /// Income (Gelir) statistics
    /// </summary>
    [JsonPropertyName("gelir")]
    public GelirStatsDto Gelir { get; set; } = new();

    /// <summary>
    /// Expense (Gider) statistics
    /// </summary>
    [JsonPropertyName("gider")]
    public GiderStatsDto Gider { get; set; } = new();

    /// <summary>
    /// Verein comparison data (for Admin only)
    /// </summary>
    [JsonPropertyName("vereinComparison")]
    public List<VereinComparisonDto>? VereinComparison { get; set; }
}

/// <summary>
/// Income statistics (Gelir)
/// </summary>
public class GelirStatsDto
{
    /// <summary>
    /// Total number of claims (Forderungen)
    /// </summary>
    [JsonPropertyName("totalForderungen")]
    public int TotalForderungen { get; set; }

    /// <summary>
    /// Number of paid claims
    /// </summary>
    [JsonPropertyName("bezahlteForderungen")]
    public int BezahlteForderungen { get; set; }

    /// <summary>
    /// Number of unpaid claims
    /// </summary>
    [JsonPropertyName("offeneForderungen")]
    public int OffeneForderungen { get; set; }

    /// <summary>
    /// Number of overdue claims
    /// </summary>
    [JsonPropertyName("ueberfaelligeForderungen")]
    public int UeberfaelligeForderungen { get; set; }

    /// <summary>
    /// Total amount of all claims
    /// </summary>
    [JsonPropertyName("totalAmount")]
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Total amount of paid claims
    /// </summary>
    [JsonPropertyName("bezahltAmount")]
    public decimal BezahltAmount { get; set; }

    /// <summary>
    /// Total amount of unpaid claims
    /// </summary>
    [JsonPropertyName("offenAmount")]
    public decimal OffenAmount { get; set; }

    /// <summary>
    /// Total amount of overdue claims
    /// </summary>
    [JsonPropertyName("ueberfaelligAmount")]
    public decimal UeberfaelligAmount { get; set; }

    /// <summary>
    /// Collection rate (percentage)
    /// </summary>
    [JsonPropertyName("collectionRate")]
    public decimal CollectionRate { get; set; }

    /// <summary>
    /// Expected revenue (total amount)
    /// </summary>
    [JsonPropertyName("expectedRevenue")]
    public decimal ExpectedRevenue { get; set; }

    /// <summary>
    /// Average Revenue Per User (ARPU)
    /// </summary>
    [JsonPropertyName("arpu")]
    public decimal Arpu { get; set; }

    /// <summary>
    /// Average payment days (negative means early, positive means late)
    /// </summary>
    [JsonPropertyName("avgPaymentDays")]
    public decimal AvgPaymentDays { get; set; }

    /// <summary>
    /// Number of active members (members with at least one Forderung)
    /// </summary>
    [JsonPropertyName("activeMitglieder")]
    public int ActiveMitglieder { get; set; }

    /// <summary>
    /// Total number of payments
    /// </summary>
    [JsonPropertyName("totalZahlungen")]
    public int TotalZahlungen { get; set; }

    /// <summary>
    /// Total amount of payments
    /// </summary>
    [JsonPropertyName("totalZahlungenAmount")]
    public decimal TotalZahlungenAmount { get; set; }

    /// <summary>
    /// Monthly revenue trend (last 12 months)
    /// </summary>
    [JsonPropertyName("monthlyTrend")]
    public List<MonthlyTrendDto> MonthlyTrend { get; set; } = new();

    /// <summary>
    /// Payment methods distribution
    /// </summary>
    [JsonPropertyName("paymentMethods")]
    public List<PaymentMethodDto> PaymentMethods { get; set; } = new();
}

/// <summary>
/// Expense statistics (Gider)
/// </summary>
public class GiderStatsDto
{
    /// <summary>
    /// Total number of DITIB payments
    /// </summary>
    [JsonPropertyName("totalDitibZahlungen")]
    public int TotalDitibZahlungen { get; set; }

    /// <summary>
    /// Number of paid DITIB payments
    /// </summary>
    [JsonPropertyName("bezahlteDitibZahlungen")]
    public int BezahlteDitibZahlungen { get; set; }

    /// <summary>
    /// Number of unpaid DITIB payments
    /// </summary>
    [JsonPropertyName("offeneDitibZahlungen")]
    public int OffeneDitibZahlungen { get; set; }

    /// <summary>
    /// Total amount of all DITIB payments
    /// </summary>
    [JsonPropertyName("totalAmount")]
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Total amount of paid DITIB payments
    /// </summary>
    [JsonPropertyName("bezahltAmount")]
    public decimal BezahltAmount { get; set; }

    /// <summary>
    /// Total amount of unpaid DITIB payments
    /// </summary>
    [JsonPropertyName("offenAmount")]
    public decimal OffenAmount { get; set; }

    /// <summary>
    /// Amount for current month
    /// </summary>
    [JsonPropertyName("currentMonthAmount")]
    public decimal CurrentMonthAmount { get; set; }

    /// <summary>
    /// Monthly expense trend (last 12 months)
    /// </summary>
    [JsonPropertyName("monthlyTrend")]
    public List<MonthlyTrendDto> MonthlyTrend { get; set; } = new();
}

/// <summary>
/// Monthly trend data point
/// </summary>
public class MonthlyTrendDto
{
    /// <summary>
    /// Month (1-12)
    /// </summary>
    [JsonPropertyName("month")]
    public int Month { get; set; }

    /// <summary>
    /// Year
    /// </summary>
    [JsonPropertyName("year")]
    public int Year { get; set; }

    /// <summary>
    /// Month name (e.g., "Januar", "Februar")
    /// </summary>
    [JsonPropertyName("monthName")]
    public string MonthName { get; set; } = string.Empty;

    /// <summary>
    /// Total amount for the month
    /// </summary>
    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    /// <summary>
    /// Number of transactions
    /// </summary>
    [JsonPropertyName("count")]
    public int Count { get; set; }
}

/// <summary>
/// Verein comparison data
/// </summary>
public class VereinComparisonDto
{
    /// <summary>
    /// Verein ID
    /// </summary>
    [JsonPropertyName("vereinId")]
    public int VereinId { get; set; }

    /// <summary>
    /// Verein name
    /// </summary>
    [JsonPropertyName("vereinName")]
    public string VereinName { get; set; } = string.Empty;

    /// <summary>
    /// Total revenue
    /// </summary>
    [JsonPropertyName("revenue")]
    public decimal Revenue { get; set; }

    /// <summary>
    /// Total expenses
    /// </summary>
    [JsonPropertyName("expenses")]
    public decimal Expenses { get; set; }

    /// <summary>
    /// Collection rate
    /// </summary>
    [JsonPropertyName("collectionRate")]
    public decimal CollectionRate { get; set; }

    /// <summary>
    /// Number of members
    /// </summary>
    [JsonPropertyName("memberCount")]
    public int MemberCount { get; set; }
}

/// <summary>
/// Payment method distribution data
/// </summary>
public class PaymentMethodDto
{
    /// <summary>
    /// Payment method name (e.g., "Überweisung", "Bar", "Lastschrift")
    /// </summary>
    [JsonPropertyName("method")]
    public string Method { get; set; } = string.Empty;

    /// <summary>
    /// Number of payments using this method
    /// </summary>
    [JsonPropertyName("count")]
    public int Count { get; set; }

    /// <summary>
    /// Total amount paid using this method
    /// </summary>
    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }
}

