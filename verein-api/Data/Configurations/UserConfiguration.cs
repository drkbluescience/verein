using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for User entity
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table configuration
        builder.ToTable("User", "Web");

        // Primary key
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(u => u.Vorname)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(u => u.Nachname)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(u => u.EmailConfirmed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(u => u.FailedLoginAttempts)
            .IsRequired()
            .HasDefaultValue(0);

        // Optional fields
        builder.Property(u => u.PasswordHash)
            .HasMaxLength(255)
            .HasColumnType("nvarchar(255)");

        builder.Property(u => u.LastLogin)
            .HasColumnType("datetime");

        builder.Property(u => u.LockoutEnd)
            .HasColumnType("datetime");

        builder.Property(u => u.Aktiv)
            .HasDefaultValue(true);

        // Audit fields
        builder.Property(u => u.Created)
            .HasColumnType("datetime");

        builder.Property(u => u.Modified)
            .HasColumnType("datetime");

        builder.Property(u => u.DeletedFlag)
            .HasDefaultValue(false);

        // Indexes for performance
        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_User_Email_Unique");

        builder.HasIndex(u => u.IsActive)
            .HasDatabaseName("IX_User_IsActive");

        builder.HasIndex(u => u.DeletedFlag)
            .HasDatabaseName("IX_User_DeletedFlag");

        // Navigation properties
        builder.HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

