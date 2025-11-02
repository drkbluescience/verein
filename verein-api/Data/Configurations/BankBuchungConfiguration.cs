using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for BankBuchung entity
/// </summary>
public class BankBuchungConfiguration : IEntityTypeConfiguration<BankBuchung>
{
    public void Configure(EntityTypeBuilder<BankBuchung> builder)
    {
        // Table configuration
        builder.ToTable("BankBuchung", "Finanz");

        // Primary key
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(b => b.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(b => b.BankKontoId)
            .IsRequired()
            .HasColumnName("BankKontoId");

        builder.Property(b => b.Buchungsdatum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("Buchungsdatum");

        builder.Property(b => b.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        builder.Property(b => b.WaehrungId)
            .IsRequired()
            .HasColumnName("WaehrungId");

        builder.Property(b => b.StatusId)
            .IsRequired()
            .HasColumnName("StatusId");

        // Optional fields
        builder.Property(b => b.Empfaenger)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Empfaenger");

        builder.Property(b => b.Verwendungszweck)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Verwendungszweck");

        builder.Property(b => b.Referenz)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Referenz");

        builder.Property(b => b.AngelegtAm)
            .HasColumnType("datetime")
            .HasColumnName("AngelegtAm");

        // Audit fields from AuditableEntity
        builder.Property(b => b.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(b => b.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(b => b.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(b => b.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(b => b.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property is not mapped - this column doesn't exist in the database table
        builder.Ignore(b => b.Aktiv);

        // Indexes
        builder.HasIndex(b => b.VereinId)
            .HasDatabaseName("IX_BankBuchung_VereinId");

        builder.HasIndex(b => b.BankKontoId)
            .HasDatabaseName("IX_BankBuchung_BankKontoId");

        builder.HasIndex(b => b.Buchungsdatum)
            .HasDatabaseName("IX_BankBuchung_Buchungsdatum");

        builder.HasIndex(b => b.StatusId)
            .HasDatabaseName("IX_BankBuchung_StatusId");

        builder.HasIndex(b => b.DeletedFlag)
            .HasDatabaseName("IX_BankBuchung_DeletedFlag");

        // Foreign key relationships
        // Cascade cycle önleme: Verein NO ACTION
        builder.HasOne(b => b.Verein)
            .WithMany()
            .HasForeignKey(b => b.VereinId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION - cycle önleme
            .HasConstraintName("FK_BankBuchung_Verein");

        builder.HasOne(b => b.BankKonto)
            .WithMany()
            .HasForeignKey(b => b.BankKontoId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION
            .HasConstraintName("FK_BankBuchung_Bankkonto");

        // Collection navigation properties
        builder.HasMany(b => b.MitgliedZahlungen)
            .WithOne(mz => mz.BankBuchung)
            .HasForeignKey(mz => mz.BankBuchungId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

