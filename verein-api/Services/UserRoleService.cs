using Microsoft.EntityFrameworkCore;
using VereinsApi.Data;
using VereinsApi.Domain.Entities;
using VereinsApi.Services.Interfaces;

namespace VereinsApi.Services;

/// <summary>
/// Service for UserRole operations
/// </summary>
public class UserRoleService : IUserRoleService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserRoleService> _logger;

    public UserRoleService(ApplicationDbContext context, ILogger<UserRoleService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserRole?> GetByIdAsync(int id)
    {
        return await _context.UserRoles
            .Include(ur => ur.User)
            .Include(ur => ur.Mitglied)
            .Include(ur => ur.Verein)
            .FirstOrDefaultAsync(ur => ur.Id == id && ur.DeletedFlag != true);
    }

    public async Task<IEnumerable<UserRole>> GetRolesByUserIdAsync(int userId)
    {
        return await _context.UserRoles
            .Include(ur => ur.Mitglied)
            .Include(ur => ur.Verein)
            .Where(ur => ur.UserId == userId && ur.DeletedFlag != true)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserRole>> GetActiveRolesByUserIdAsync(int userId)
    {
        var now = DateTime.Now.Date;
        
        return await _context.UserRoles
            .Include(ur => ur.Mitglied)
            .Include(ur => ur.Verein)
            .Where(ur => ur.UserId == userId 
                && ur.DeletedFlag != true 
                && ur.IsActive
                && ur.GueltigVon <= now
                && (ur.GueltigBis == null || ur.GueltigBis >= now))
            .ToListAsync();
    }

    public async Task<UserRole?> GetPrimaryRoleAsync(int userId)
    {
        var roles = await GetActiveRolesByUserIdAsync(userId);
        
        // Priority: admin > dernek > mitglied
        return roles
            .OrderByDescending(r => GetRolePriority(r.RoleType))
            .FirstOrDefault();
    }

    public async Task<bool> HasRoleAsync(int userId, string roleType)
    {
        var roles = await GetActiveRolesByUserIdAsync(userId);
        return roles.Any(r => r.RoleType.Equals(roleType, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<UserRole> CreateAsync(UserRole userRole)
    {
        userRole.Created = DateTime.UtcNow;
        userRole.DeletedFlag = false;

        _context.UserRoles.Add(userRole);
        await _context.SaveChangesAsync();

        _logger.LogInformation("UserRole created: UserId={UserId}, RoleType={RoleType}", 
            userRole.UserId, userRole.RoleType);
        return userRole;
    }

    public async Task<UserRole> UpdateAsync(UserRole userRole)
    {
        userRole.Modified = DateTime.UtcNow;

        _context.UserRoles.Update(userRole);
        await _context.SaveChangesAsync();

        _logger.LogInformation("UserRole updated: Id={Id}, RoleType={RoleType}", 
            userRole.Id, userRole.RoleType);
        return userRole;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var userRole = await GetByIdAsync(id);
        if (userRole == null)
            return false;

        userRole.DeletedFlag = true;
        userRole.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("UserRole soft deleted: Id={Id}", id);
        return true;
    }

    public async Task<bool> DeactivateAsync(int id)
    {
        var userRole = await GetByIdAsync(id);
        if (userRole == null)
            return false;

        userRole.IsActive = false;
        userRole.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("UserRole deactivated: Id={Id}", id);
        return true;
    }

    public async Task<bool> ActivateAsync(int id)
    {
        var userRole = await GetByIdAsync(id);
        if (userRole == null)
            return false;

        userRole.IsActive = true;
        userRole.Modified = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("UserRole activated: Id={Id}", id);
        return true;
    }

    private static int GetRolePriority(string roleType)
    {
        return roleType.ToLower() switch
        {
            "admin" => 3,
            "dernek" => 2,
            "mitglied" => 1,
            _ => 0
        };
    }
}

