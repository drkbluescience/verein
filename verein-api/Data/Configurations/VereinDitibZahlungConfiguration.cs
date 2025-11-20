using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for VereinDitibZahlung entity
/// </summary>
public class VereinDitibZahlungConfiguration : IEntityTypeConfiguration<VereinDitibZahlung>
{
    public void Configure(EntityTypeBuilder<VereinDitibZahlung> builder)
    {
        // Table configuration
        builder.ToTable("VereinDitibZahlung", "Finanz");

        // Primary key
        builder.HasKey(z => z.Id);
        builder.Property(z => z.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(z => z.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

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

        builder.Property(z => z.Zahlungsperiode)
            .IsRequired()
            .HasMaxLength(7)
            .HasColumnType("nvarchar(7)")
            .HasColumnName("Zahlungsperiode");

        builder.Property(z => z.StatusId)
            .IsRequired()
            .HasColumnName("StatusId");

        // Optional fields
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

        // Audit fields
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

        // Ignore Aktiv property - column doesn't exist in database yet
        builder.Ignore(z => z.Aktiv);

        // Indexes
        builder.HasIndex(z => z.VereinId)
            .HasDatabaseName("IX_VereinDitibZahlung_VereinId");

        builder.HasIndex(z => z.Zahlungsdatum)
            .HasDatabaseName("IX_VereinDitibZahlung_Zahlungsdatum");

        builder.HasIndex(z => z.Zahlungsperiode)
            .HasDatabaseName("IX_VereinDitibZahlung_Zahlungsperiode");

        builder.HasIndex(z => new { z.VereinId, z.Zahlungsperiode })
            .HasDatabaseName("IX_VereinDitibZahlung_VereinId_Zahlungsperiode");

        // Foreign key relationships
        // Cascade cycle prevention: Verein NO ACTION
        builder.HasOne(z => z.Verein)
            .WithMany()
            .HasForeignKey(z => z.VereinId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION - cycle prevention
            .HasConstraintName("FK_VereinDitibZahlung_Verein");

        builder.HasOne(z => z.Bankkonto)
            .WithMany()
            .HasForeignKey(z => z.BankkontoId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_VereinDitibZahlung_Bankkonto");

        builder.HasOne(z => z.BankBuchung)
            .WithMany()
            .HasForeignKey(z => z.BankBuchungId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_VereinDitibZahlung_BankBuchung");
    }
}

