using Microsoft.EntityFrameworkCore;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data;

/// <summary>
/// Seed data class - NOT USED ANYMORE
/// Demo data is now managed via SQL scripts in docs/DEMO_DATA.sql
/// This class is kept for reference only
/// </summary>
public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Demo data is now managed via SQL scripts
        // See: docs/DEMO_DATA.sql
        // This method does nothing
        await Task.CompletedTask;
    }
}
