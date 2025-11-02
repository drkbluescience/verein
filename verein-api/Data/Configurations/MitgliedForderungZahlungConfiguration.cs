using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for MitgliedForderungZahlung entity
/// </summary>
public class MitgliedForderungZahlungConfiguration : IEntityTypeConfiguration<MitgliedForderungZahlung>
{
    public void Configure(EntityTypeBuilder<MitgliedForderungZahlung> builder)
    {
        // Table configuration
        builder.ToTable("MitgliedForderungZahlung", "Finanz");

        // Primary key
        builder.HasKey(fz => fz.Id);
        builder.Property(fz => fz.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(fz => fz.ForderungId)
            .IsRequired()
            .HasColumnName("ForderungId");

        builder.Property(fz => fz.ZahlungId)
            .IsRequired()
            .HasColumnName("ZahlungId");

        builder.Property(fz => fz.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        // Audit fields from AuditableEntity
        builder.Property(fz => fz.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(fz => fz.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(fz => fz.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(fz => fz.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(fz => fz.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property is not mapped - this column doesn't exist in the database table
        builder.Ignore(fz => fz.Aktiv);

        // Indexes
        builder.HasIndex(fz => fz.ForderungId)
            .HasDatabaseName("IX_MitgliedForderungZahlung_ForderungId");

        builder.HasIndex(fz => fz.ZahlungId)
            .HasDatabaseName("IX_MitgliedForderungZahlung_ZahlungId");

        builder.HasIndex(fz => fz.DeletedFlag)
            .HasDatabaseName("IX_MitgliedForderungZahlung_DeletedFlag");

        // Unique constraint to prevent duplicate allocations
        builder.HasIndex(fz => new { fz.ForderungId, fz.ZahlungId })
            .IsUnique()
            .HasDatabaseName("IX_MitgliedForderungZahlung_ForderungId_ZahlungId");

        // Foreign key relationships
        builder.HasOne(fz => fz.Forderung)
            .WithMany(f => f.ForderungZahlungen)
            .HasForeignKey(fz => fz.ForderungId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_MitgliedForderungZahlung_MitgliedForderung");

        builder.HasOne(fz => fz.Zahlung)
            .WithMany(z => z.ForderungZahlungen)
            .HasForeignKey(fz => fz.ZahlungId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_MitgliedForderungZahlung_MitgliedZahlung");
    }
}

