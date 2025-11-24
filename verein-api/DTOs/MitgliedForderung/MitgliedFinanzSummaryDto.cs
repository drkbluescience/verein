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
}

