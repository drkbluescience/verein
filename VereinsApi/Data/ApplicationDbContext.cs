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
    /// Associations (Vereine) table
    /// </summary>
    public DbSet<Association> Associations { get; set; }

    /// <summary>
    /// Members table
    /// </summary>
    public DbSet<Member> Members { get; set; }

    /// <summary>
    /// Addresses table
    /// </summary>
    public DbSet<Address> Addresses { get; set; }

    /// <summary>
    /// Bank accounts table
    /// </summary>
    public DbSet<BankAccount> BankAccounts { get; set; }

    /// <summary>
    /// Legal forms table
    /// </summary>
    public DbSet<LegalForm> LegalForms { get; set; }

    /// <summary>
    /// Association members junction table
    /// </summary>
    public DbSet<AssociationMember> AssociationMembers { get; set; }

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply entity configurations
        modelBuilder.ApplyConfiguration(new AssociationConfiguration());
        modelBuilder.ApplyConfiguration(new MemberConfiguration());
        modelBuilder.ApplyConfiguration(new AddressConfiguration());
        modelBuilder.ApplyConfiguration(new BankAccountConfiguration());
        modelBuilder.ApplyConfiguration(new LegalFormConfiguration());
        modelBuilder.ApplyConfiguration(new AssociationMemberConfiguration());

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
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.Created = DateTime.UtcNow;
                    entry.Entity.IsDeleted = false;
                    entry.Entity.IsActive = true;
                    break;

                case EntityState.Modified:
                    entry.Entity.Modified = DateTime.UtcNow;
                    // Prevent modification of Created and CreatedBy fields
                    entry.Property(e => e.Created).IsModified = false;
                    entry.Property(e => e.CreatedBy).IsModified = false;
                    break;
            }
        }
    }

    private void ApplyGlobalQueryFilters(ModelBuilder modelBuilder)
    {
        // Apply global query filter to exclude soft-deleted entities by default
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
                var filter = Expression.Lambda(Expression.Equal(property, Expression.Constant(false)), parameter);
                
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

        // Configure datetime2 for DateTime properties
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))
        {
            property.SetColumnType("datetime2");
        }
    }
}
