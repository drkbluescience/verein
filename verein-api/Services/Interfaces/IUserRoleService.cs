using VereinsApi.Domain.Entities;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for UserRole operations
/// </summary>
public interface IUserRoleService
{
    /// <summary>
    /// Get user role by ID
    /// </summary>
    Task<UserRole?> GetByIdAsync(int id);

    /// <summary>
    /// Get all roles for a user
    /// </summary>
    Task<IEnumerable<UserRole>> GetRolesByUserIdAsync(int userId);

    /// <summary>
    /// Get active roles for a user
    /// </summary>
    Task<IEnumerable<UserRole>> GetActiveRolesByUserIdAsync(int userId);

    /// <summary>
    /// Get primary role for a user (highest priority)
    /// </summary>
    Task<UserRole?> GetPrimaryRoleAsync(int userId);

    /// <summary>
    /// Check if user has specific role type
    /// </summary>
    Task<bool> HasRoleAsync(int userId, string roleType);

    /// <summary>
    /// Create new user role
    /// </summary>
    Task<UserRole> CreateAsync(UserRole userRole);

    /// <summary>
    /// Update existing user role
    /// </summary>
    Task<UserRole> UpdateAsync(UserRole userRole);

    /// <summary>
    /// Soft delete user role
    /// </summary>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Deactivate user role
    /// </summary>
    Task<bool> DeactivateAsync(int id);

    /// <summary>
    /// Activate user role
    /// </summary>
    Task<bool> ActivateAsync(int id);
}

