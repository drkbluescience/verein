using VereinsApi.DTOs.Brief;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for Nachricht (Sent Message) business operations
/// </summary>
public interface INachrichtService
{
    /// <summary>
    /// Gets a message by ID
    /// </summary>
    Task<NachrichtDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all messages for a specific member (inbox)
    /// </summary>
    Task<IEnumerable<NachrichtDto>> GetByMitgliedIdAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unread messages for a specific member
    /// </summary>
    Task<IEnumerable<NachrichtDto>> GetUnreadByMitgliedIdAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all messages sent from a specific letter
    /// </summary>
    Task<IEnumerable<NachrichtDto>> GetByBriefIdAsync(int briefId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all messages sent by a specific Verein
    /// </summary>
    Task<IEnumerable<NachrichtDto>> GetByVereinIdAsync(int vereinId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks a message as read
    /// </summary>
    Task<NachrichtDto> MarkAsReadAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks multiple messages as read
    /// </summary>
    Task<int> MarkMultipleAsReadAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes a message (for member)
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets unread message count for a specific member
    /// </summary>
    Task<int> GetUnreadCountAsync(int mitgliedId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets message statistics for a specific member
    /// </summary>
    Task<BriefStatisticsDto> GetMemberStatisticsAsync(int mitgliedId, CancellationToken cancellationToken = default);
}

