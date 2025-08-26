using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Adresse entity
/// </summary>
public class AdresseConfiguration : IEntityTypeConfiguration<Adresse>
{
    public void Configure(EntityTypeBuilder<Adresse> builder)
    {
        // Table configuration - Almanca tablo adı kullan
        builder.ToTable("Adresse", "Verein");

        // Primary key
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(a => a.VereinId)
            .IsRequired();

        // Optional string fields with specific lengths - Almanca kolon isimleri
        builder.Property(a => a.Strasse)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Strasse");

        builder.Property(a => a.Hausnummer)
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("Hausnummer");

        builder.Property(a => a.Adresszusatz)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Adresszusatz");

        builder.Property(a => a.PLZ)
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("PLZ");

        builder.Property(a => a.Ort)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Ort");

        builder.Property(a => a.Stadtteil)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Stadtteil");

        builder.Property(a => a.Bundesland)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Bundesland");

        builder.Property(a => a.Land)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Land")
            .HasDefaultValue("Deutschland");

        builder.Property(a => a.Postfach)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("Postfach");

        builder.Property(a => a.Telefonnummer)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Telefonnummer");

        builder.Property(a => a.Faxnummer)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Faxnummer");

        builder.Property(a => a.EMail)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("EMail");

        builder.Property(a => a.Kontaktperson)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Kontaktperson");

        builder.Property(a => a.Hinweis)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Hinweis");

        // Decimal fields
        builder.Property(a => a.Latitude)
            .HasColumnType("decimal(10,8)")
            .HasColumnName("Latitude");

        builder.Property(a => a.Longitude)
            .HasColumnType("decimal(11,8)")
            .HasColumnName("Longitude");

        // Date fields - Almanca kolon isimleri
        builder.Property(a => a.GueltigVon)
            .HasColumnType("date")
            .HasColumnName("GueltigVon");

        builder.Property(a => a.GueltigBis)
            .HasColumnType("date")
            .HasColumnName("GueltigBis");

        // Boolean fields
        builder.Property(a => a.IstStandard)
            .HasColumnName("IstStandard");

        // Audit fields from AuditableEntity - Almanca kolon isimleri ve datetime tipi
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
        builder.HasIndex(a => a.VereinId)
            .HasDatabaseName("IX_Adresse_VereinId");

        builder.HasIndex(a => a.PLZ)
            .HasDatabaseName("IX_Adresse_PLZ");

        builder.HasIndex(a => a.Ort)
            .HasDatabaseName("IX_Adresse_Ort");

        builder.HasIndex(a => a.DeletedFlag)
            .HasDatabaseName("IX_Adresse_DeletedFlag");

        // Foreign key relationships
        builder.Property(a => a.AdresseTypId)
            .HasColumnName("AdresseTypId");

        builder.HasOne(a => a.Verein)
            .WithMany()
            .HasForeignKey(a => a.VereinId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
