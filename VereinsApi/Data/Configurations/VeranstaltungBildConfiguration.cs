using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for VeranstaltungBild entity
/// </summary>
public class VeranstaltungBildConfiguration : IEntityTypeConfiguration<VeranstaltungBild>
{
    public void Configure(EntityTypeBuilder<VeranstaltungBild> builder)
    {
        // Table configuration - Almanca tablo adı kullan
        builder.ToTable("VeranstaltungBild", "Verein");

        // Primary key
        builder.HasKey(vb => vb.Id);
        builder.Property(vb => vb.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(vb => vb.VeranstaltungId)
            .IsRequired();

        builder.Property(vb => vb.BildPfad)
            .IsRequired()
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("BildPfad");

        // Optional string fields with specific lengths - Almanca kolon isimleri
        builder.Property(vb => vb.Titel)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Titel");



        // Integer fields
        builder.Property(vb => vb.Reihenfolge)
            .IsRequired()
            .HasColumnName("Reihenfolge")
            .HasDefaultValue(1);

        // Audit fields from AuditableEntity - Almanca kolon isimleri ve datetime tipi
        builder.Property(vb => vb.Created)
            .IsRequired()
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(vb => vb.Modified)
            .HasColumnType("datetime");

        builder.Property(vb => vb.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false)
            .HasColumnName("DeletedFlag");

        builder.Property(vb => vb.Aktiv)
            .HasColumnName("Aktiv");

        // Indexes for performance
        builder.HasIndex(vb => vb.VeranstaltungId)
            .HasDatabaseName("IX_VeranstaltungBild_VeranstaltungId");

        builder.HasIndex(vb => vb.Reihenfolge)
            .HasDatabaseName("IX_VeranstaltungBild_Reihenfolge");

        builder.HasIndex(vb => vb.DeletedFlag)
            .HasDatabaseName("IX_VeranstaltungBild_DeletedFlag");

        // Foreign key relationships
        builder.HasOne(vb => vb.Veranstaltung)
            .WithMany(v => v.VeranstaltungBilder)
            .HasForeignKey(vb => vb.VeranstaltungId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
