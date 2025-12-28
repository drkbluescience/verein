using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for SpendenProtokoll (Donation Protocol) entity
/// </summary>
public class SpendenProtokollConfiguration : IEntityTypeConfiguration<SpendenProtokoll>
{
    public void Configure(EntityTypeBuilder<SpendenProtokoll> builder)
    {
        // Table configuration
        builder.ToTable("SpendenProtokoll", "Finanz");

        // Primary key
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(s => s.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(s => s.Datum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("Datum");

        builder.Property(s => s.Zweck)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Zweck");

        builder.Property(s => s.Betrag)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Betrag");

        builder.Property(s => s.Protokollant)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Protokollant");

        // Optional fields
        builder.Property(s => s.ZweckKategorie)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("ZweckKategorie");

        builder.Property(s => s.Zeuge1Name)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Zeuge1Name");

        builder.Property(s => s.Zeuge1Unterschrift)
            .HasDefaultValue(false)
            .HasColumnName("Zeuge1Unterschrift");

        builder.Property(s => s.Zeuge2Name)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Zeuge2Name");

        builder.Property(s => s.Zeuge2Unterschrift)
            .HasDefaultValue(false)
            .HasColumnName("Zeuge2Unterschrift");

        builder.Property(s => s.Zeuge3Name)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Zeuge3Name");

        builder.Property(s => s.Zeuge3Unterschrift)
            .HasDefaultValue(false)
            .HasColumnName("Zeuge3Unterschrift");

        builder.Property(s => s.KassenbuchId)
            .HasColumnName("KassenbuchId");

        builder.Property(s => s.Bemerkung)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Bemerkung");

        // Audit fields
        builder.Property(s => s.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(s => s.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(s => s.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(s => s.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(s => s.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Ignore Aktiv from AuditableEntity
        builder.Ignore(s => s.Aktiv);

        // Indexes
        builder.HasIndex(s => new { s.VereinId, s.Datum })
            .HasDatabaseName("IX_SpendenProtokoll_VereinDatum");

        builder.HasIndex(s => s.ZweckKategorie)
            .HasDatabaseName("IX_SpendenProtokoll_ZweckKategorie");

        builder.HasIndex(s => s.KassenbuchId)
            .HasDatabaseName("IX_SpendenProtokoll_KassenbuchId");

        // Foreign key relationships
        builder.HasOne(s => s.Verein)
            .WithMany()
            .HasForeignKey(s => s.VereinId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_SpendenProtokoll_Verein");

        builder.HasOne(s => s.Kassenbuch)
            .WithMany(k => k.SpendenProtokolle)
            .HasForeignKey(s => s.KassenbuchId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_SpendenProtokoll_Kassenbuch");
    }
}

