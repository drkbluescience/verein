using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for KassenbuchJahresabschluss (Year-End Closing) entity
/// </summary>
public class KassenbuchJahresabschlussConfiguration : IEntityTypeConfiguration<KassenbuchJahresabschluss>
{
    public void Configure(EntityTypeBuilder<KassenbuchJahresabschluss> builder)
    {
        // Table configuration
        builder.ToTable("KassenbuchJahresabschluss", "Finanz");

        // Primary key
        builder.HasKey(j => j.Id);
        builder.Property(j => j.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(j => j.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(j => j.Jahr)
            .IsRequired()
            .HasColumnName("Jahr");

        builder.Property(j => j.KasseAnfangsbestand)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("KasseAnfangsbestand");

        builder.Property(j => j.KasseEndbestand)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("KasseEndbestand");

        builder.Property(j => j.BankAnfangsbestand)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("BankAnfangsbestand");

        builder.Property(j => j.BankEndbestand)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("BankEndbestand");

        builder.Property(j => j.AbschlussDatum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("AbschlussDatum");

        // Optional fields
        builder.Property(j => j.SparbuchEndbestand)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("SparbuchEndbestand");

        builder.Property(j => j.Geprueft)
            .HasDefaultValue(false)
            .HasColumnName("Geprueft");

        builder.Property(j => j.GeprueftVon)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("GeprueftVon");

        builder.Property(j => j.GeprueftAm)
            .HasColumnType("date")
            .HasColumnName("GeprueftAm");

        builder.Property(j => j.Bemerkung)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Bemerkung");

        // Audit fields
        builder.Property(j => j.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(j => j.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(j => j.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(j => j.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(j => j.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Ignore Aktiv from AuditableEntity
        builder.Ignore(j => j.Aktiv);

        // Unique constraint: One closing per association per year
        builder.HasIndex(j => new { j.VereinId, j.Jahr })
            .IsUnique()
            .HasDatabaseName("UQ_Jahresabschluss_VereinJahr");

        builder.HasIndex(j => j.Jahr)
            .HasDatabaseName("IX_KassenbuchJahresabschluss_Jahr");

        builder.HasIndex(j => j.Geprueft)
            .HasDatabaseName("IX_KassenbuchJahresabschluss_Geprueft");

        // Foreign key relationships
        builder.HasOne(j => j.Verein)
            .WithMany()
            .HasForeignKey(j => j.VereinId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_KassenbuchJahresabschluss_Verein");
    }
}

