namespace VereinsApi.Domain.Models;

/// <summary>
/// Statistics model for events
/// </summary>
public class EventStatistics
{
    /// <summary>
    /// Total number of events
    /// </summary>
    public int TotalEvents { get; set; }

    /// <summary>
    /// Number of upcoming events
    /// </summary>
    public int UpcomingEvents { get; set; }

    /// <summary>
    /// Number of past events
    /// </summary>
    public int PastEvents { get; set; }

    /// <summary>
    /// Number of ongoing events
    /// </summary>
    public int OngoingEvents { get; set; }

    /// <summary>
    /// Number of events requiring registration
    /// </summary>
    public int EventsRequiringRegistration { get; set; }

    /// <summary>
    /// Number of member-only events
    /// </summary>
    public int MemberOnlyEvents { get; set; }

    /// <summary>
    /// Number of public events
    /// </summary>
    public int PublicEvents { get; set; }

    /// <summary>
    /// Number of free events
    /// </summary>
    public int FreeEvents { get; set; }

    /// <summary>
    /// Number of paid events
    /// </summary>
    public int PaidEvents { get; set; }

    /// <summary>
    /// Total number of registrations across all events
    /// </summary>
    public int TotalRegistrations { get; set; }

    /// <summary>
    /// Average number of registrations per event
    /// </summary>
    public double AverageRegistrationsPerEvent { get; set; }

    /// <summary>
    /// Average event price
    /// </summary>
    public decimal AverageEventPrice { get; set; }

    /// <summary>
    /// Total revenue from all events
    /// </summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>
    /// Events by category distribution
    /// </summary>
    public Dictionary<string, int> EventsByCategory { get; set; } = new();

    /// <summary>
    /// Events by month distribution
    /// </summary>
    public Dictionary<string, int> EventsByMonth { get; set; } = new();

    /// <summary>
    /// Events by location distribution
    /// </summary>
    public Dictionary<string, int> EventsByLocation { get; set; } = new();

    /// <summary>
    /// Average event duration in hours
    /// </summary>
    public double AverageEventDurationHours { get; set; }

    /// <summary>
    /// Number of events with images
    /// </summary>
    public int EventsWithImages { get; set; }

    /// <summary>
    /// Total number of event images
    /// </summary>
    public int TotalEventImages { get; set; }

    /// <summary>
    /// Average number of images per event
    /// </summary>
    public double AverageImagesPerEvent { get; set; }

    /// <summary>
    /// Events with full capacity (100% registered)
    /// </summary>
    public int EventsWithFullCapacity { get; set; }

    /// <summary>
    /// Average capacity utilization rate
    /// </summary>
    public double AverageCapacityUtilization { get; set; }

    /// <summary>
    /// Number of cancelled events
    /// </summary>
    public int CancelledEvents { get; set; }
}
