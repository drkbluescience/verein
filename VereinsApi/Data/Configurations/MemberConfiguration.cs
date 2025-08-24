using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Member entity
/// </summary>
public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        // Table configuration
        builder.ToTable("Member");

        // Primary key
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id)
            .ValueGeneratedOnAdd();

        // Required fields
        builder.Property(m => m.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.LastName)
            .IsRequired()
            .HasMaxLength(100);

        // Optional fields with specific lengths
        builder.Property(m => m.Email)
            .HasMaxLength(100);

        builder.Property(m => m.Phone)
            .HasMaxLength(30);

        builder.Property(m => m.MemberNumber)
            .HasMaxLength(50);

        builder.Property(m => m.MembershipType)
            .HasMaxLength(50);

        builder.Property(m => m.Status)
            .HasMaxLength(20)
            .HasDefaultValue("Active");

        // Date fields
        builder.Property(m => m.DateOfBirth)
            .HasColumnType("date");

        builder.Property(m => m.JoinDate)
            .HasColumnType("date");

        // Audit fields from BaseEntity
        builder.Property(m => m.Created)
            .IsRequired()
            .HasColumnType("datetime2")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(m => m.Modified)
            .HasColumnType("datetime2");

        builder.Property(m => m.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(m => m.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Relationships
        builder.HasOne(m => m.Address)
            .WithMany(a => a.Members)
            .HasForeignKey(m => m.AddressId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes for performance
        builder.HasIndex(m => m.Email)
            .HasDatabaseName("IX_Member_Email");

        builder.HasIndex(m => m.MemberNumber)
            .IsUnique()
            .HasFilter("[MemberNumber] IS NOT NULL")
            .HasDatabaseName("IX_Member_MemberNumber");

        builder.HasIndex(m => m.LastName)
            .HasDatabaseName("IX_Member_LastName");

        builder.HasIndex(m => m.IsActive)
            .HasDatabaseName("IX_Member_IsActive");

        builder.HasIndex(m => m.IsDeleted)
            .HasDatabaseName("IX_Member_IsDeleted");

        builder.HasIndex(m => new { m.IsActive, m.IsDeleted })
            .HasDatabaseName("IX_Member_IsActive_IsDeleted");
    }
}
