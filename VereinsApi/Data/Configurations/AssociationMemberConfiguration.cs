using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for AssociationMember entity
/// </summary>
public class AssociationMemberConfiguration : IEntityTypeConfiguration<AssociationMember>
{
    public void Configure(EntityTypeBuilder<AssociationMember> builder)
    {
        // Table configuration
        builder.ToTable("AssociationMember");

        // Primary key
        builder.HasKey(am => am.Id);
        builder.Property(am => am.Id)
            .ValueGeneratedOnAdd();

        // Required fields
        builder.Property(am => am.AssociationId)
            .IsRequired();

        builder.Property(am => am.MemberId)
            .IsRequired();

        // Optional fields with specific lengths
        builder.Property(am => am.Role)
            .HasMaxLength(50);

        // Date fields
        builder.Property(am => am.JoinDate)
            .HasColumnType("date");

        builder.Property(am => am.LeaveDate)
            .HasColumnType("date");

        // Audit fields from BaseEntity
        builder.Property(am => am.Created)
            .IsRequired()
            .HasColumnType("datetime2")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(am => am.Modified)
            .HasColumnType("datetime2");

        builder.Property(am => am.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(am => am.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Relationships
        builder.HasOne(am => am.Association)
            .WithMany(a => a.AssociationMembers)
            .HasForeignKey(am => am.AssociationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(am => am.Member)
            .WithMany(m => m.AssociationMembers)
            .HasForeignKey(am => am.MemberId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraint for association-member combination
        builder.HasIndex(am => new { am.AssociationId, am.MemberId })
            .IsUnique()
            .HasDatabaseName("IX_AssociationMember_AssociationId_MemberId");

        // Indexes for performance
        builder.HasIndex(am => am.AssociationId)
            .HasDatabaseName("IX_AssociationMember_AssociationId");

        builder.HasIndex(am => am.MemberId)
            .HasDatabaseName("IX_AssociationMember_MemberId");

        builder.HasIndex(am => am.Role)
            .HasDatabaseName("IX_AssociationMember_Role");

        builder.HasIndex(am => am.IsActive)
            .HasDatabaseName("IX_AssociationMember_IsActive");

        builder.HasIndex(am => am.IsDeleted)
            .HasDatabaseName("IX_AssociationMember_IsDeleted");

        builder.HasIndex(am => new { am.IsActive, am.IsDeleted })
            .HasDatabaseName("IX_AssociationMember_IsActive_IsDeleted");
    }
}
