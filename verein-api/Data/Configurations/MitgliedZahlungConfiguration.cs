using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for MitgliedZahlung entity
/// </summary>
public class MitgliedZahlungConfiguration : IEntityTypeConfiguration<MitgliedZahlung>
{
    public void Configure(EntityTypeBuilder<MitgliedZahlung> builder)
    {
        // Table configuration
        builder.ToTable("MitgliedZahlung", "Finanz");

        // Primary key
        builder.HasKey(z => z.Id);
        builder.Property(z => z.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(z => z.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(z => z.MitgliedId)
            .IsRequired()
            .HasColumnName("MitgliedId");

        builder.Property(z => z.ZahlungTypId)
            .IsRequired()
            .HasColumnName("ZahlungTypId");

        builder.Property(z => z.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        builder.Property(z => z.WaehrungId)
            .IsRequired()
            .HasColumnName("WaehrungId");

        builder.Property(z => z.Zahlungsdatum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("Zahlungsdatum");

        builder.Property(z => z.StatusId)
            .IsRequired()
            .HasColumnName("StatusId");

        // Optional fields
        builder.Property(z => z.ForderungId)
            .HasColumnName("ForderungId");

        builder.Property(z => z.Zahlungsweg)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Zahlungsweg");

        builder.Property(z => z.BankkontoId)
            .HasColumnName("BankkontoId");

        builder.Property(z => z.Referenz)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Referenz");

        builder.Property(z => z.Bemerkung)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Bemerkung");

        builder.Property(z => z.BankBuchungId)
            .HasColumnName("BankBuchungId");

        // Audit fields from AuditableEntity
        builder.Property(z => z.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(z => z.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(z => z.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(z => z.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(z => z.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property is not mapped - this column doesn't exist in the database table
        builder.Ignore(z => z.Aktiv);

        // Indexes
        builder.HasIndex(z => z.VereinId)
            .HasDatabaseName("IX_MitgliedZahlung_VereinId");

        builder.HasIndex(z => z.MitgliedId)
            .HasDatabaseName("IX_MitgliedZahlung_MitgliedId");

        builder.HasIndex(z => z.ForderungId)
            .HasDatabaseName("IX_MitgliedZahlung_ForderungId");

        builder.HasIndex(z => z.Zahlungsdatum)
            .HasDatabaseName("IX_MitgliedZahlung_Zahlungsdatum");

        builder.HasIndex(z => z.StatusId)
            .HasDatabaseName("IX_MitgliedZahlung_StatusId");

        builder.HasIndex(z => z.BankBuchungId)
            .HasDatabaseName("IX_MitgliedZahlung_BankBuchungId");

        builder.HasIndex(z => z.DeletedFlag)
            .HasDatabaseName("IX_MitgliedZahlung_DeletedFlag");

        // Foreign key relationships
        // Cascade cycle önleme: Verein NO ACTION
        builder.HasOne(z => z.Verein)
            .WithMany()
            .HasForeignKey(z => z.VereinId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION - cycle önleme
            .HasConstraintName("FK_MitgliedZahlung_Verein");

        builder.HasOne(z => z.Mitglied)
            .WithMany()
            .HasForeignKey(z => z.MitgliedId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION
            .HasConstraintName("FK_MitgliedZahlung_Mitglied");

        builder.HasOne(z => z.Forderung)
            .WithMany(f => f.MitgliedZahlungen)
            .HasForeignKey(z => z.ForderungId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_MitgliedZahlung_MitgliedForderung");

        builder.HasOne(z => z.Bankkonto)
            .WithMany()
            .HasForeignKey(z => z.BankkontoId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_MitgliedZahlung_Bankkonto");

        builder.HasOne(z => z.BankBuchung)
            .WithMany(b => b.MitgliedZahlungen)
            .HasForeignKey(z => z.BankBuchungId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_MitgliedZahlung_BankBuchung");

        // Collection navigation properties
        builder.HasMany(z => z.ForderungZahlungen)
            .WithOne(fz => fz.Zahlung)
            .HasForeignKey(fz => fz.ZahlungId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(z => z.Vorauszahlungen)
            .WithOne(v => v.Zahlung)
            .HasForeignKey(v => v.ZahlungId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

