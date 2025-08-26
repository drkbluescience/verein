using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Verein entity
/// </summary>
public class VereinConfiguration : IEntityTypeConfiguration<Verein>
{
    public void Configure(EntityTypeBuilder<Verein> builder)
    {
        // Table configuration - Almanca tablo adı kullan
        builder.ToTable("Verein", "Verein");

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

        // Optional string fields with specific lengths - Almanca kolon isimleri
        builder.Property(a => a.Zweck)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Zweck");

        builder.Property(a => a.Telefon)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Telefon");

        builder.Property(a => a.Fax)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Fax");

        builder.Property(a => a.Email)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Email");

        builder.Property(a => a.Webseite)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Webseite");



        // Date fields - Almanca kolon isimleri
        builder.Property(a => a.Gruendungsdatum)
            .HasColumnType("date")
            .HasColumnName("Gruendungsdatum");

        // Foreign key fields
        builder.Property(a => a.RechtsformId)
            .HasColumnName("RechtsformId");

        // Audit fields from BaseEntity - Almanca kolon isimleri ve datetime tipi
        builder.Property(a => a.Created)
            .IsRequired()
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(a => a.Modified)
            .HasColumnType("datetime");

        builder.Property(a => a.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false)
            .HasColumnName("DeletedFlag");

        builder.Property(a => a.Aktiv)
            .HasColumnName("Aktiv");

        // Indexes for performance
        builder.HasIndex(a => a.Name)
            .HasDatabaseName("IX_Verein_Name");

        builder.HasIndex(a => a.Email)
            .HasDatabaseName("IX_Verein_Email");

        builder.HasIndex(a => a.DeletedFlag)
            .HasDatabaseName("IX_Verein_DeletedFlag");

        // Foreign key relationships - Almanca kolon isimleri
        builder.Property(a => a.RechtsformId)
            .HasColumnName("RechtsformId");

        builder.Property(a => a.AdresseId)
            .HasColumnName("AdresseId");

        builder.Property(a => a.HauptBankkontoId)
            .HasColumnName("HauptBankkontoId");

        builder.HasOne(a => a.HauptAdresse)
            .WithMany(addr => addr.VereineAsMainAddress)
            .HasForeignKey(a => a.AdresseId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.HauptBankkonto)
            .WithMany(ba => ba.VereineAsMainBankAccount)
            .HasForeignKey(a => a.HauptBankkontoId)
            .OnDelete(DeleteBehavior.SetNull);

        // Collection navigation properties
        builder.HasMany(v => v.Adressen)
            .WithOne(a => a.Verein)
            .HasForeignKey(a => a.VereinId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(v => v.Bankkonten)
            .WithOne(b => b.Verein)
            .HasForeignKey(b => b.VereinId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
