using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VereinsApi.Data.Configurations;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data;

/// <summary>
/// Application database context for Verein API
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    #region DbSets

    /// <summary>
    /// Vereine table
    /// </summary>
    public DbSet<Verein> Vereine { get; set; }

    /// <summary>
    /// Adressen table
    /// </summary>
    public DbSet<Adresse> Adressen { get; set; }

    /// <summary>
    /// Bankkonten table
    /// </summary>
    public DbSet<Bankkonto> Bankkonten { get; set; }

    /// <summary>
    /// Veranstaltungen table
    /// </summary>
    public DbSet<Veranstaltung> Veranstaltungen { get; set; }

    /// <summary>
    /// Veranstaltung Anmeldungen table
    /// </summary>
    public DbSet<VeranstaltungAnmeldung> VeranstaltungAnmeldungen { get; set; }

    /// <summary>
    /// Veranstaltung Bilder table
    /// </summary>
    public DbSet<VeranstaltungBild> VeranstaltungBilder { get; set; }

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply entity configurations
        modelBuilder.ApplyConfiguration(new VereinConfiguration());
        modelBuilder.ApplyConfiguration(new AdresseConfiguration());
        modelBuilder.ApplyConfiguration(new BankkontoConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungAnmeldungConfiguration());
        modelBuilder.ApplyConfiguration(new VeranstaltungBildConfiguration());

        // Apply global query filters for soft delete
        ApplyGlobalQueryFilters(modelBuilder);

        // Configure database schema
        ConfigureSchema(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // This will be overridden by DI configuration in Program.cs
            optionsBuilder.UseSqlite("Data Source=verein.db");
        }

        // Suppress migration warnings for development
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Update audit fields before saving
        UpdateAuditFields();
        
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        // Update audit fields before saving
        UpdateAuditFields();
        
        return base.SaveChanges();
    }

    private void UpdateAuditFields()
    {
        var entries = ChangeTracker.Entries<AuditableEntity>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Created = DateTime.UtcNow;
                    entry.Entity.DeletedFlag = false;
                    entry.Entity.Aktiv = true;
                    break;

                case EntityState.Modified:
                    entry.Entity.Modified = DateTime.UtcNow;
                    // Prevent modification of Created field
                    entry.Property(e => e.Created).IsModified = false;
                    break;
            }
        }
    }

    private void ApplyGlobalQueryFilters(ModelBuilder modelBuilder)
    {
        // Apply global query filter to exclude soft-deleted entities by default
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(AuditableEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(AuditableEntity.DeletedFlag));
                var filter = Expression.Lambda(Expression.Equal(property, Expression.Constant(false, typeof(bool?))), parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
            }
        }
    }

    private void ConfigureSchema(ModelBuilder modelBuilder)
    {
        // Set default schema
        modelBuilder.HasDefaultSchema("Verein");

        // Configure decimal precision globally
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetColumnType("decimal(18,2)");
        }

        // Configure datetime for DateTime properties (Almanca SQL dosyasına uygun)
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))
        {
            property.SetColumnType("datetime");
        }
    }
}
