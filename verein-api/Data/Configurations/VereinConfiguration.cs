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

        builder.Property(a => a.Kurzname)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Kurzname");

        builder.Property(a => a.Vereinsnummer)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Vereinsnummer");

        builder.Property(a => a.Steuernummer)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Steuernummer");

        builder.Property(a => a.SocialMediaLinks)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("SocialMediaLinks");

        builder.Property(a => a.Vorstandsvorsitzender)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Vorstandsvorsitzender");

        builder.Property(a => a.Geschaeftsfuehrer)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Geschaeftsfuehrer");

        builder.Property(a => a.VertreterEmail)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("VertreterEmail");

        builder.Property(a => a.Kontaktperson)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Kontaktperson");

        builder.Property(a => a.SatzungPfad)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("SatzungPfad");

        builder.Property(a => a.LogoPfad)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("LogoPfad");

        builder.Property(a => a.ExterneReferenzId)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("ExterneReferenzId");

        builder.Property(a => a.Mandantencode)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Mandantencode");

        builder.Property(a => a.EPostEmpfangAdresse)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("EPostEmpfangAdresse");

        builder.Property(a => a.SEPA_GlaeubigerID)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("SEPA_GlaeubigerID");

        builder.Property(a => a.UstIdNr)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("UstIdNr");

        builder.Property(a => a.ElektronischeSignaturKey)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("ElektronischeSignaturKey");

        // Integer fields
        builder.Property(a => a.Mitgliederzahl)
            .HasColumnName("Mitgliederzahl");

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
            .OnDelete(DeleteBehavior.Restrict); // NO ACTION - cascade cycle önleme
    }
}
