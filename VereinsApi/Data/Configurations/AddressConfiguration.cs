using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Address entity
/// </summary>
public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        // Table configuration
        builder.ToTable("Address");

        // Primary key
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id)
            .ValueGeneratedOnAdd();

        // String fields with specific lengths
        builder.Property(a => a.Street)
            .HasMaxLength(200);

        builder.Property(a => a.HouseNumber)
            .HasMaxLength(20);

        builder.Property(a => a.PostalCode)
            .HasMaxLength(20);

        builder.Property(a => a.City)
            .HasMaxLength(100);

        builder.Property(a => a.Country)
            .HasMaxLength(100)
            .HasDefaultValue("Deutschland");

        builder.Property(a => a.AddressType)
            .HasMaxLength(50);

        // Audit fields from BaseEntity
        builder.Property(a => a.Created)
            .IsRequired()
            .HasColumnType("datetime2")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(a => a.Modified)
            .HasColumnType("datetime2");

        builder.Property(a => a.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(a => a.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes for performance
        builder.HasIndex(a => a.PostalCode)
            .HasDatabaseName("IX_Address_PostalCode");

        builder.HasIndex(a => a.City)
            .HasDatabaseName("IX_Address_City");

        builder.HasIndex(a => a.AddressType)
            .HasDatabaseName("IX_Address_AddressType");

        builder.HasIndex(a => a.IsActive)
            .HasDatabaseName("IX_Address_IsActive");

        builder.HasIndex(a => a.IsDeleted)
            .HasDatabaseName("IX_Address_IsDeleted");

        builder.HasIndex(a => new { a.IsActive, a.IsDeleted })
            .HasDatabaseName("IX_Address_IsActive_IsDeleted");
    }
}
