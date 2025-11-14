using VereinsApi.Domain.Entities;

namespace VereinsApi.Services.Interfaces;

/// <summary>
/// Service interface for User operations
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Get user by ID
    /// </summary>
    Task<User?> GetByIdAsync(int id);

    /// <summary>
    /// Get user by email
    /// </summary>
    Task<User?> GetByEmailAsync(string email);

    /// <summary>
    /// Get all users
    /// </summary>
    Task<IEnumerable<User>> GetAllAsync();

    /// <summary>
    /// Get active users only
    /// </summary>
    Task<IEnumerable<User>> GetActiveUsersAsync();

    /// <summary>
    /// Create new user
    /// </summary>
    Task<User> CreateAsync(User user);

    /// <summary>
    /// Update existing user
    /// </summary>
    Task<User> UpdateAsync(User user);

    /// <summary>
    /// Soft delete user
    /// </summary>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Update last login timestamp
    /// </summary>
    Task UpdateLastLoginAsync(int userId);

    /// <summary>
    /// Increment failed login attempts
    /// </summary>
    Task IncrementFailedLoginAttemptsAsync(int userId);

    /// <summary>
    /// Reset failed login attempts
    /// </summary>
    Task ResetFailedLoginAttemptsAsync(int userId);

    /// <summary>
    /// Lock user account
    /// </summary>
    Task LockAccountAsync(int userId, DateTime lockoutEnd);

    /// <summary>
    /// Unlock user account
    /// </summary>
    Task UnlockAccountAsync(int userId);
}

