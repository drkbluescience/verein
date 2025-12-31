using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Organization entity
/// </summary>
public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        // Table configuration
        builder.ToTable("Organization", "Verein");

        // Primary key
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(o => o.Name)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(o => o.OrgType)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        builder.Property(o => o.FederationCode)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        builder.Property(o => o.ParentOrganizationId)
            .HasColumnName("ParentOrganizationId");

        // Audit fields from AuditableEntity
        builder.Property(o => o.Created)
            .IsRequired()
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(o => o.Modified)
            .HasColumnType("datetime");

        builder.Property(o => o.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false)
            .HasColumnName("DeletedFlag");

        builder.Property(o => o.Aktiv)
            .HasColumnName("Aktiv");

        // Indexes for performance
        builder.HasIndex(o => o.ParentOrganizationId)
            .HasDatabaseName("IX_Organization_ParentOrganizationId");

        builder.HasIndex(o => o.OrgType)
            .HasDatabaseName("IX_Organization_OrgType");

        builder.HasIndex(o => o.FederationCode)
            .HasDatabaseName("IX_Organization_FederationCode");

        builder.HasIndex(o => o.DeletedFlag)
            .HasDatabaseName("IX_Organization_DeletedFlag");

        // Self-referencing relationship (no cascade delete)
        builder.HasOne(o => o.ParentOrganization)
            .WithMany(o => o.Children)
            .HasForeignKey(o => o.ParentOrganizationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasCheckConstraint(
            "CK_Organization_ParentNotSelf",
            "[ParentOrganizationId] IS NULL OR [ParentOrganizationId] <> [Id]");
    }
}
