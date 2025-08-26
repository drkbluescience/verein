namespace VereinsApi.Domain.Models;

/// <summary>
/// Statistics model for event registrations
/// </summary>
public class RegistrationStatistics
{
    /// <summary>
    /// Total number of registrations
    /// </summary>
    public int TotalRegistrations { get; set; }

    /// <summary>
    /// Number of confirmed registrations
    /// </summary>
    public int ConfirmedRegistrations { get; set; }

    /// <summary>
    /// Number of pending registrations
    /// </summary>
    public int PendingRegistrations { get; set; }

    /// <summary>
    /// Number of cancelled registrations
    /// </summary>
    public int CancelledRegistrations { get; set; }

    /// <summary>
    /// Number of registrations with payment completed
    /// </summary>
    public int PaidRegistrations { get; set; }

    /// <summary>
    /// Number of registrations with pending payment
    /// </summary>
    public int UnpaidRegistrations { get; set; }

    /// <summary>
    /// Total revenue from registrations
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Average age of participants
    /// </summary>
    public double AverageAge { get; set; }

    /// <summary>
    /// Gender distribution of participants
    /// </summary>
    public Dictionary<string, int> GenderDistribution { get; set; } = new();

    /// <summary>
    /// Payment method distribution
    /// </summary>
    public Dictionary<string, int> PaymentMethodDistribution { get; set; } = new();

    /// <summary>
    /// Registration date distribution (by day)
    /// </summary>
    public Dictionary<DateTime, int> RegistrationsByDate { get; set; } = new();

    /// <summary>
    /// Number of registrations with dietary restrictions
    /// </summary>
    public int RegistrationsWithDietaryRestrictions { get; set; }

    /// <summary>
    /// Number of member registrations
    /// </summary>
    public int MemberRegistrations { get; set; }

    /// <summary>
    /// Number of non-member registrations
    /// </summary>
    public int NonMemberRegistrations { get; set; }

    /// <summary>
    /// Average registration price
    /// </summary>
    public decimal AverageRegistrationPrice { get; set; }

    /// <summary>
    /// Number of registrations checked in
    /// </summary>
    public int CheckedInRegistrations { get; set; }

    /// <summary>
    /// Check-in rate as percentage
    /// </summary>
    public double CheckInRate { get; set; }
}
