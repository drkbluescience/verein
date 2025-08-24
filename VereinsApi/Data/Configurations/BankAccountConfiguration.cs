using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for BankAccount entity
/// </summary>
public class BankAccountConfiguration : IEntityTypeConfiguration<BankAccount>
{
    public void Configure(EntityTypeBuilder<BankAccount> builder)
    {
        // Table configuration
        builder.ToTable("BankAccount");

        // Primary key
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .ValueGeneratedOnAdd();

        // String fields with specific lengths
        builder.Property(b => b.BankName)
            .HasMaxLength(200);

        builder.Property(b => b.IBAN)
            .HasMaxLength(34);

        builder.Property(b => b.BIC)
            .HasMaxLength(11);

        builder.Property(b => b.AccountHolder)
            .HasMaxLength(200);

        builder.Property(b => b.AccountType)
            .HasMaxLength(50);

        // Audit fields from BaseEntity
        builder.Property(b => b.Created)
            .IsRequired()
            .HasColumnType("datetime2")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(b => b.Modified)
            .HasColumnType("datetime2");

        builder.Property(b => b.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(b => b.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes for performance
        builder.HasIndex(b => b.IBAN)
            .IsUnique()
            .HasFilter("[IBAN] IS NOT NULL")
            .HasDatabaseName("IX_BankAccount_IBAN");

        builder.HasIndex(b => b.BankName)
            .HasDatabaseName("IX_BankAccount_BankName");

        builder.HasIndex(b => b.AccountType)
            .HasDatabaseName("IX_BankAccount_AccountType");

        builder.HasIndex(b => b.IsActive)
            .HasDatabaseName("IX_BankAccount_IsActive");

        builder.HasIndex(b => b.IsDeleted)
            .HasDatabaseName("IX_BankAccount_IsDeleted");

        builder.HasIndex(b => new { b.IsActive, b.IsDeleted })
            .HasDatabaseName("IX_BankAccount_IsActive_IsDeleted");
    }
}
