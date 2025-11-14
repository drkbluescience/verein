using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service for User operations
/// </summary>
public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id && u.DeletedFlag != true);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Email == email && u.DeletedFlag != true);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .Where(u => u.DeletedFlag != true)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .Where(u => u.DeletedFlag != true && u.IsActive)
            .ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        user.Created = DateTime.UtcNow;
        user.DeletedFlag = false;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User created: {Email}", user.Email);
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        user.Modified = DateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User updated: {Email}", user.Email);
        return user;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await GetByIdAsync(id);
        if (user == null)
            return false;

        user.DeletedFlag = true;
        user.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("User soft deleted: {Email}", user.Email);
        return true;
    }

    public async Task UpdateLastLoginAsync(int userId)
    {
        var user = await GetByIdAsync(userId);
        if (user != null)
        {
            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task IncrementFailedLoginAttemptsAsync(int userId)
    {
        var user = await GetByIdAsync(userId);
        if (user != null)
        {
            user.FailedLoginAttempts++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task ResetFailedLoginAttemptsAsync(int userId)
    {
        var user = await GetByIdAsync(userId);
        if (user != null)
        {
            user.FailedLoginAttempts = 0;
            await _context.SaveChangesAsync();
        }
    }

    public async Task LockAccountAsync(int userId, DateTime lockoutEnd)
    {
        var user = await GetByIdAsync(userId);
        if (user != null)
        {
            user.LockoutEnd = lockoutEnd;
            user.IsActive = false;
            await _context.SaveChangesAsync();

            _logger.LogWarning("User account locked: {Email} until {LockoutEnd}", user.Email, lockoutEnd);
        }
    }

    public async Task UnlockAccountAsync(int userId)
    {
        var user = await GetByIdAsync(userId);
        if (user != null)
        {
            user.LockoutEnd = null;
            user.IsActive = true;
            user.FailedLoginAttempts = 0;
            await _context.SaveChangesAsync();

            _logger.LogInformation("User account unlocked: {Email}", user.Email);
        }
    }
}

