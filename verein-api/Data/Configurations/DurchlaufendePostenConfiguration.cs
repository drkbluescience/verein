using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for DurchlaufendePosten (Transit Items) entity
/// </summary>
public class DurchlaufendePostenConfiguration : IEntityTypeConfiguration<DurchlaufendePosten>
{
    public void Configure(EntityTypeBuilder<DurchlaufendePosten> builder)
    {
        // Table configuration
        builder.ToTable("DurchlaufendePosten", "Finanz");

        // Primary key
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(d => d.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(d => d.FiBuNummer)
            .IsRequired()
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("FiBuNummer");

        builder.Property(d => d.Bezeichnung)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Bezeichnung");

        builder.Property(d => d.EinnahmenDatum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("EinnahmenDatum");

        builder.Property(d => d.EinnahmenBetrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("EinnahmenBetrag");

        // Optional fields
        builder.Property(d => d.AusgabenDatum)
            .HasColumnType("date")
            .HasColumnName("AusgabenDatum");

        builder.Property(d => d.AusgabenBetrag)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("AusgabenBetrag");

        builder.Property(d => d.Empfaenger)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Empfaenger");

        builder.Property(d => d.Referenz)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Referenz");

        builder.Property(d => d.Status)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasDefaultValue("OFFEN")
            .HasColumnName("Status");

        builder.Property(d => d.KassenbuchEinnahmeId)
            .HasColumnName("KassenbuchEinnahmeId");

        builder.Property(d => d.KassenbuchAusgabeId)
            .HasColumnName("KassenbuchAusgabeId");

        builder.Property(d => d.Bemerkung)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Bemerkung");

        // Audit fields
        builder.Property(d => d.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(d => d.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(d => d.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(d => d.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(d => d.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Ignore Aktiv from AuditableEntity
        builder.Ignore(d => d.Aktiv);

        // Indexes
        builder.HasIndex(d => new { d.VereinId, d.EinnahmenDatum })
            .HasDatabaseName("IX_DurchlaufendePosten_VereinDatum");

        builder.HasIndex(d => d.FiBuNummer)
            .HasDatabaseName("IX_DurchlaufendePosten_FiBuNummer");

        builder.HasIndex(d => d.Status)
            .HasDatabaseName("IX_DurchlaufendePosten_Status");

        // Foreign key relationships
        builder.HasOne(d => d.Verein)
            .WithMany()
            .HasForeignKey(d => d.VereinId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_DurchlaufendePosten_Verein");

        builder.HasOne(d => d.FiBuKonto)
            .WithMany(f => f.DurchlaufendePosten)
            .HasForeignKey(d => d.FiBuNummer)
            .HasPrincipalKey(f => f.Nummer)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_DurchlaufendePosten_FiBuKonto");

        builder.HasOne(d => d.KassenbuchEinnahme)
            .WithMany(k => k.DurchlaufendePostenEinnahmen)
            .HasForeignKey(d => d.KassenbuchEinnahmeId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_DurchlaufendePosten_KassenbuchEinnahme");

        builder.HasOne(d => d.KassenbuchAusgabe)
            .WithMany(k => k.DurchlaufendePostenAusgaben)
            .HasForeignKey(d => d.KassenbuchAusgabeId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_DurchlaufendePosten_KassenbuchAusgabe");
    }
}

