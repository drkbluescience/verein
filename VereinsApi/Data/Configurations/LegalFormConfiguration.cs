using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for LegalForm entity
/// </summary>
public class LegalFormConfiguration : IEntityTypeConfiguration<LegalForm>
{
    public void Configure(EntityTypeBuilder<LegalForm> builder)
    {
        // Table configuration
        builder.ToTable("LegalForm");

        // Primary key
        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id)
            .ValueGeneratedOnAdd();

        // Required fields
        builder.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        // Optional fields with specific lengths
        builder.Property(l => l.ShortName)
            .HasMaxLength(20);

        builder.Property(l => l.Description)
            .HasMaxLength(500);

        // Audit fields from BaseEntity
        builder.Property(l => l.Created)
            .IsRequired()
            .HasColumnType("datetime2")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(l => l.Modified)
            .HasColumnType("datetime2");

        builder.Property(l => l.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(l => l.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes for performance
        builder.HasIndex(l => l.Name)
            .IsUnique()
            .HasDatabaseName("IX_LegalForm_Name");

        builder.HasIndex(l => l.ShortName)
            .IsUnique()
            .HasFilter("[ShortName] IS NOT NULL")
            .HasDatabaseName("IX_LegalForm_ShortName");

        builder.HasIndex(l => l.IsActive)
            .HasDatabaseName("IX_LegalForm_IsActive");

        builder.HasIndex(l => l.IsDeleted)
            .HasDatabaseName("IX_LegalForm_IsDeleted");

        builder.HasIndex(l => new { l.IsActive, l.IsDeleted })
            .HasDatabaseName("IX_LegalForm_IsActive_IsDeleted");
    }
}
