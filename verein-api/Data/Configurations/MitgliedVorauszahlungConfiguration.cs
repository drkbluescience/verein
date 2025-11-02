using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for MitgliedVorauszahlung entity
/// </summary>
public class MitgliedVorauszahlungConfiguration : IEntityTypeConfiguration<MitgliedVorauszahlung>
{
    public void Configure(EntityTypeBuilder<MitgliedVorauszahlung> builder)
    {
        // Table configuration
        builder.ToTable("MitgliedVorauszahlung", "Finanz");

        // Primary key
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(v => v.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(v => v.MitgliedId)
            .IsRequired()
            .HasColumnName("MitgliedId");

        builder.Property(v => v.ZahlungId)
            .IsRequired()
            .HasColumnName("ZahlungId");

        builder.Property(v => v.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        builder.Property(v => v.WaehrungId)
            .IsRequired()
            .HasColumnName("WaehrungId");

        // Optional fields
        builder.Property(v => v.Beschreibung)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Beschreibung");

        // Audit fields from AuditableEntity
        builder.Property(v => v.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(v => v.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(v => v.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(v => v.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(v => v.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property is not mapped - this column doesn't exist in the database table
        builder.Ignore(v => v.Aktiv);

        // Indexes
        builder.HasIndex(v => v.VereinId)
            .HasDatabaseName("IX_MitgliedVorauszahlung_VereinId");

        builder.HasIndex(v => v.MitgliedId)
            .HasDatabaseName("IX_MitgliedVorauszahlung_MitgliedId");

        builder.HasIndex(v => v.ZahlungId)
            .HasDatabaseName("IX_MitgliedVorauszahlung_ZahlungId");

        builder.HasIndex(v => v.DeletedFlag)
            .HasDatabaseName("IX_MitgliedVorauszahlung_DeletedFlag");

        // Foreign key relationships
        // Cascade cycle önleme: Verein NO ACTION
        builder.HasOne(v => v.Verein)
            .WithMany()
            .HasForeignKey(v => v.VereinId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION - cycle önleme
            .HasConstraintName("FK_MitgliedVorauszahlung_Verein");

        builder.HasOne(v => v.Mitglied)
            .WithMany()
            .HasForeignKey(v => v.MitgliedId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION
            .HasConstraintName("FK_MitgliedVorauszahlung_Mitglied");

        builder.HasOne(v => v.Zahlung)
            .WithMany(z => z.Vorauszahlungen)
            .HasForeignKey(v => v.ZahlungId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION
            .HasConstraintName("FK_MitgliedVorauszahlung_MitgliedZahlung");
    }
}

