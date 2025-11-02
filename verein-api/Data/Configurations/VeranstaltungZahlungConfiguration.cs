using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for VeranstaltungZahlung entity
/// </summary>
public class VeranstaltungZahlungConfiguration : IEntityTypeConfiguration<VeranstaltungZahlung>
{
    public void Configure(EntityTypeBuilder<VeranstaltungZahlung> builder)
    {
        // Table configuration
        builder.ToTable("VeranstaltungZahlung", "Finanz");

        // Primary key
        builder.HasKey(vz => vz.Id);
        builder.Property(vz => vz.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(vz => vz.VeranstaltungId)
            .IsRequired()
            .HasColumnName("VeranstaltungId");

        builder.Property(vz => vz.AnmeldungId)
            .IsRequired()
            .HasColumnName("AnmeldungId");

        builder.Property(vz => vz.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        builder.Property(vz => vz.WaehrungId)
            .IsRequired()
            .HasColumnName("WaehrungId");

        builder.Property(vz => vz.Zahlungsdatum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("Zahlungsdatum");

        builder.Property(vz => vz.StatusId)
            .IsRequired()
            .HasColumnName("StatusId");

        // Optional fields
        builder.Property(vz => vz.Name)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Name");

        builder.Property(vz => vz.Email)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Email");

        builder.Property(vz => vz.Zahlungsweg)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Zahlungsweg");

        builder.Property(vz => vz.Referenz)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Referenz");

        // Audit fields from AuditableEntity
        builder.Property(vz => vz.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(vz => vz.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(vz => vz.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(vz => vz.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(vz => vz.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property is not mapped - this column doesn't exist in the database table
        builder.Ignore(vz => vz.Aktiv);

        // Indexes
        builder.HasIndex(vz => vz.VeranstaltungId)
            .HasDatabaseName("IX_VeranstaltungZahlung_VeranstaltungId");

        builder.HasIndex(vz => vz.AnmeldungId)
            .HasDatabaseName("IX_VeranstaltungZahlung_AnmeldungId");

        builder.HasIndex(vz => vz.Zahlungsdatum)
            .HasDatabaseName("IX_VeranstaltungZahlung_Zahlungsdatum");

        builder.HasIndex(vz => vz.StatusId)
            .HasDatabaseName("IX_VeranstaltungZahlung_StatusId");

        builder.HasIndex(vz => vz.DeletedFlag)
            .HasDatabaseName("IX_VeranstaltungZahlung_DeletedFlag");

        // Foreign key relationships
        // Cascade cycle'ı önlemek için Veranstaltung NO ACTION, Anmeldung CASCADE
        builder.HasOne(vz => vz.Veranstaltung)
            .WithMany()
            .HasForeignKey(vz => vz.VeranstaltungId)
            .OnDelete(DeleteBehavior.Restrict) // NO ACTION - cycle önleme
            .HasConstraintName("FK_VeranstaltungZahlung_Veranstaltung");

        builder.HasOne(vz => vz.Anmeldung)
            .WithMany()
            .HasForeignKey(vz => vz.AnmeldungId)
            .OnDelete(DeleteBehavior.Cascade) // CASCADE - Anmeldung silinince ödeme de silinsin
            .HasConstraintName("FK_VeranstaltungZahlung_VeranstaltungAnmeldung")
            .IsRequired(false);
    }
}

