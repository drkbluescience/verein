using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for MitgliedForderung entity
/// </summary>
public class MitgliedForderungConfiguration : IEntityTypeConfiguration<MitgliedForderung>
{
    public void Configure(EntityTypeBuilder<MitgliedForderung> builder)
    {
        // Table configuration
        builder.ToTable("MitgliedForderung", "Finanz");

        // Primary key
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(f => f.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(f => f.MitgliedId)
            .IsRequired()
            .HasColumnName("MitgliedId");

        builder.Property(f => f.ZahlungTypId)
            .IsRequired()
            .HasColumnName("ZahlungTypId");

        builder.Property(f => f.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        builder.Property(f => f.WaehrungId)
            .IsRequired()
            .HasColumnName("WaehrungId");

        builder.Property(f => f.Faelligkeit)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("Faelligkeit");

        builder.Property(f => f.StatusId)
            .IsRequired()
            .HasColumnName("StatusId");

        // Optional fields
        builder.Property(f => f.Forderungsnummer)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Forderungsnummer");

        builder.Property(f => f.Jahr)
            .HasColumnName("Jahr");

        builder.Property(f => f.Quartal)
            .HasColumnName("Quartal");

        builder.Property(f => f.Monat)
            .HasColumnName("Monat");

        builder.Property(f => f.Beschreibung)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Beschreibung");

        builder.Property(f => f.BezahltAm)
            .HasColumnType("date")
            .HasColumnName("BezahltAm");

        // Audit fields from AuditableEntity
        builder.Property(f => f.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(f => f.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(f => f.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(f => f.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(f => f.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property is not mapped - this column doesn't exist in the database table
        builder.Ignore(f => f.Aktiv);

        // Indexes
        builder.HasIndex(f => f.VereinId)
            .HasDatabaseName("IX_MitgliedForderung_VereinId");

        builder.HasIndex(f => f.MitgliedId)
            .HasDatabaseName("IX_MitgliedForderung_MitgliedId");

        builder.HasIndex(f => f.Forderungsnummer)
            .HasDatabaseName("IX_MitgliedForderung_Forderungsnummer");

        builder.HasIndex(f => f.Faelligkeit)
            .HasDatabaseName("IX_MitgliedForderung_Faelligkeit");

        builder.HasIndex(f => f.StatusId)
            .HasDatabaseName("IX_MitgliedForderung_StatusId");

        builder.HasIndex(f => f.DeletedFlag)
            .HasDatabaseName("IX_MitgliedForderung_DeletedFlag");

        builder.HasIndex(f => new { f.Jahr, f.Monat })
            .HasDatabaseName("IX_MitgliedForderung_JahrMonat");

        // Foreign key relationships
        // Cascade cycle önleme: Verein NO ACTION
        builder.HasOne(f => f.Verein)
            .WithMany()
            .HasForeignKey(f => f.VereinId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION - cycle önleme
            .HasConstraintName("FK_MitgliedForderung_Verein");

        builder.HasOne(f => f.Mitglied)
            .WithMany()
            .HasForeignKey(f => f.MitgliedId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION
            .HasConstraintName("FK_MitgliedForderung_Mitglied");

        // Collection navigation properties
        builder.HasMany(f => f.MitgliedZahlungen)
            .WithOne(mz => mz.Forderung)
            .HasForeignKey(mz => mz.ForderungId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(f => f.ForderungZahlungen)
            .WithOne(fz => fz.Forderung)
            .HasForeignKey(fz => fz.ForderungId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

