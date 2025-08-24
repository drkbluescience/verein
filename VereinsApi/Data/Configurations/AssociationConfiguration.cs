using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Association entity
/// </summary>
public class AssociationConfiguration : IEntityTypeConfiguration<Association>
{
    public void Configure(EntityTypeBuilder<Association> builder)
    {
        // Table configuration
        builder.ToTable("Association", "Verein");

        // Primary key
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        // Optional string fields with specific lengths
        builder.Property(a => a.ShortName)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(a => a.AssociationNumber)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)");

        builder.Property(a => a.TaxNumber)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)");

        builder.Property(a => a.Purpose)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(a => a.Phone)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)");

        builder.Property(a => a.Fax)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)");

        builder.Property(a => a.Email)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(a => a.Website)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(a => a.SocialMediaLinks)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(a => a.ChairmanName)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(a => a.ManagerName)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(a => a.RepresentativeEmail)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(a => a.ContactPersonName)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(a => a.StatutePath)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(a => a.LogoPath)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(a => a.ExternalReferenceId)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(a => a.ClientCode)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(a => a.EPostReceiveAddress)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(a => a.SEPACreditorId)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(a => a.VATNumber)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)");

        builder.Property(a => a.ElectronicSignatureKey)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        // Date fields
        builder.Property(a => a.FoundingDate)
            .HasColumnType("date");

        // Audit fields from BaseEntity
        builder.Property(a => a.Created)
            .IsRequired()
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(a => a.Modified)
            .HasColumnType("datetime2");

        builder.Property(a => a.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(a => a.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes for performance
        builder.HasIndex(a => a.Name)
            .HasDatabaseName("IX_Association_Name");

        builder.HasIndex(a => a.AssociationNumber)
            .IsUnique()
            .HasFilter("[AssociationNumber] IS NOT NULL")
            .HasDatabaseName("IX_Association_AssociationNumber");

        builder.HasIndex(a => a.ClientCode)
            .IsUnique()
            .HasFilter("[ClientCode] IS NOT NULL")
            .HasDatabaseName("IX_Association_ClientCode");

        builder.HasIndex(a => a.Email)
            .HasDatabaseName("IX_Association_Email");

        builder.HasIndex(a => a.IsActive)
            .HasDatabaseName("IX_Association_IsActive");

        builder.HasIndex(a => a.IsDeleted)
            .HasDatabaseName("IX_Association_IsDeleted");

        builder.HasIndex(a => new { a.IsActive, a.IsDeleted })
            .HasDatabaseName("IX_Association_IsActive_IsDeleted");

        // Future foreign key relationships (commented out until related entities are created)
        /*
        builder.HasOne(a => a.LegalForm)
            .WithMany()
            .HasForeignKey(a => a.LegalFormId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.MainAddress)
            .WithMany()
            .HasForeignKey(a => a.MainAddressId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.MainBankAccount)
            .WithMany()
            .HasForeignKey(a => a.MainBankAccountId)
            .OnDelete(DeleteBehavior.SetNull);
        */
    }
}
