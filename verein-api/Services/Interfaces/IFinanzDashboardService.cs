using VereinsApi.DTOs.Finanz;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service for Finanz Dashboard statistics and aggregations
/// </summary>
public interface IFinanzDashboardService
{
    /// <summary>
    /// Get dashboard statistics for a specific Verein or all Vereine (for Admin)
    /// </summary>
    /// <param name="vereinId">Optional Verein ID filter</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dashboard statistics</returns>
    Task<FinanzDashboardStatsDto> GetDashboardStatsAsync(int? vereinId = null, CancellationToken cancellationToken = default);
}

