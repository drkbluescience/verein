using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Veranstaltung entity
/// </summary>
public class VeranstaltungConfiguration : IEntityTypeConfiguration<Veranstaltung>
{
    public void Configure(EntityTypeBuilder<Veranstaltung> builder)
    {
        // Table configuration - Almanca tablo adı kullan
        builder.ToTable("Veranstaltung", "Verein");

        // Primary key
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(v => v.VereinId)
            .IsRequired();

        builder.Property(v => v.Titel)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Titel");

        builder.Property(v => v.Startdatum)
            .IsRequired()
            .HasColumnType("datetime")
            .HasColumnName("Beginn");

        // Optional string fields with specific lengths - Almanca kolon isimleri
        builder.Property(v => v.Beschreibung)
            .HasMaxLength(2000)
            .HasColumnType("nvarchar(2000)")
            .HasColumnName("Beschreibung");

        builder.Property(v => v.Ort)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Ort");



        // Date fields - Almanca kolon isimleri
        builder.Property(v => v.Enddatum)
            .HasColumnType("datetime")
            .HasColumnName("Ende");

        // Decimal fields
        builder.Property(v => v.Preis)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Preis");

        // Integer fields
        builder.Property(v => v.MaxTeilnehmer)
            .HasColumnName("MaxTeilnehmer");

        // Boolean fields - These fields are removed from entity as they don't exist in SQL table
        // builder.Property(v => v.NurFuerMitglieder)
        //     .HasColumnName("NurFuerMitglieder");

        // builder.Property(v => v.AnmeldeErforderlich)
        //     .HasColumnName("AnmeldeErforderlich");

        // Audit fields from AuditableEntity - Almanca kolon isimleri ve datetime tipi
        builder.Property(v => v.Created)
            .IsRequired()
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(v => v.Modified)
            .HasColumnType("datetime");

        builder.Property(v => v.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false)
            .HasColumnName("DeletedFlag");

        builder.Property(v => v.Aktiv)
            .HasColumnName("Aktiv");

        // Indexes for performance
        builder.HasIndex(v => v.VereinId)
            .HasDatabaseName("IX_Veranstaltung_VereinId");

        builder.HasIndex(v => v.Startdatum)
            .HasDatabaseName("IX_Veranstaltung_Startdatum");

        builder.HasIndex(v => v.Titel)
            .HasDatabaseName("IX_Veranstaltung_Titel");

        builder.HasIndex(v => v.DeletedFlag)
            .HasDatabaseName("IX_Veranstaltung_DeletedFlag");

        builder.HasIndex(v => v.Aktiv)
            .HasDatabaseName("IX_Veranstaltung_Aktiv");

        // Foreign key relationships
        builder.Property(v => v.WaehrungId)
            .HasColumnName("WaehrungId");

        builder.HasOne(v => v.Verein)
            .WithMany()
            .HasForeignKey(v => v.VereinId)
            .OnDelete(DeleteBehavior.Cascade);

        // Navigation properties
        builder.HasMany(v => v.VeranstaltungAnmeldungen)
            .WithOne(va => va.Veranstaltung)
            .HasForeignKey(va => va.VeranstaltungId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(v => v.VeranstaltungBilder)
            .WithOne(vb => vb.Veranstaltung)
            .HasForeignKey(vb => vb.VeranstaltungId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

