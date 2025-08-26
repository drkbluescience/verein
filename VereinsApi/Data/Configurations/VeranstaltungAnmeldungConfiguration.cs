using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for VeranstaltungAnmeldung entity
/// </summary>
public class VeranstaltungAnmeldungConfiguration : IEntityTypeConfiguration<VeranstaltungAnmeldung>
{
    public void Configure(EntityTypeBuilder<VeranstaltungAnmeldung> builder)
    {
        // Table configuration - Almanca tablo adı kullan
        builder.ToTable("VeranstaltungAnmeldung", "Verein");

        // Primary key
        builder.HasKey(va => va.Id);
        builder.Property(va => va.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(va => va.VeranstaltungId)
            .IsRequired();

        // Optional string fields with specific lengths - Almanca kolon isimleri
        builder.Property(va => va.Name)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Name");

        builder.Property(va => va.Email)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Email");

        builder.Property(va => va.Telefon)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Telefon");

        builder.Property(va => va.Status)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("Status");

        builder.Property(va => va.Bemerkung)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Bemerkung");

        // Decimal fields
        builder.Property(va => va.Preis)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Preis");

        // Integer fields
        builder.Property(va => va.MitgliedId)
            .HasColumnName("MitgliedId");

        builder.Property(va => va.WaehrungId)
            .HasColumnName("WaehrungId");

        builder.Property(va => va.ZahlungStatusId)
            .HasColumnName("ZahlungStatusId");

        // Audit fields from AuditableEntity - Almanca kolon isimleri ve datetime tipi
        builder.Property(va => va.Created)
            .IsRequired()
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(va => va.Modified)
            .HasColumnType("datetime");

        builder.Property(va => va.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false)
            .HasColumnName("DeletedFlag");

        builder.Property(va => va.Aktiv)
            .HasColumnName("Aktiv");

        // Indexes for performance
        builder.HasIndex(va => va.VeranstaltungId)
            .HasDatabaseName("IX_VeranstaltungAnmeldung_VeranstaltungId");

        builder.HasIndex(va => va.Email)
            .HasDatabaseName("IX_VeranstaltungAnmeldung_Email");

        builder.HasIndex(va => va.Status)
            .HasDatabaseName("IX_VeranstaltungAnmeldung_Status");

        builder.HasIndex(va => va.DeletedFlag)
            .HasDatabaseName("IX_VeranstaltungAnmeldung_DeletedFlag");

        // Foreign key relationships

        builder.HasOne(va => va.Veranstaltung)
            .WithMany(v => v.VeranstaltungAnmeldungen)
            .HasForeignKey(va => va.VeranstaltungId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
