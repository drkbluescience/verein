using System.Text.Json.Serialization;

namespace VereinsApi.DTOs.MitgliedForderung;

/// <summary>
/// Data Transfer Object for monthly payment trend
/// </summary>
public class MonthlyTrendDto
{
    /// <summary>
    /// Month number (1-12)
    /// </summary>
    [JsonPropertyName("month")]
    public int Month { get; set; }

    /// <summary>
    /// Year
    /// </summary>
    [JsonPropertyName("year")]
    public int Year { get; set; }

    /// <summary>
    /// Month name (e.g., "Jan 25")
    /// </summary>
    [JsonPropertyName("monthName")]
    public string MonthName { get; set; } = string.Empty;

    /// <summary>
    /// Total payment amount for the month
    /// </summary>
    [JsonPropertyName("amount")]
    public decimal Amount { get; set; }

    /// <summary>
    /// Number of payments in the month
    /// </summary>
    [JsonPropertyName("count")]
    public int Count { get; set; }
}

