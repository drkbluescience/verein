using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for FiBuKonto (Chart of Accounts) entity
/// </summary>
public class FiBuKontoConfiguration : IEntityTypeConfiguration<FiBuKonto>
{
    public void Configure(EntityTypeBuilder<FiBuKonto> builder)
    {
        // Table configuration
        builder.ToTable("FiBuKonto", "Finanz");

        // Primary key
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(f => f.Nummer)
            .IsRequired()
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("Nummer");

        builder.Property(f => f.Bezeichnung)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("Bezeichnung");

        builder.Property(f => f.Bereich)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("Bereich");

        builder.Property(f => f.Typ)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("Typ");

        // Optional fields
        builder.Property(f => f.BezeichnungTR)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)")
            .HasColumnName("BezeichnungTR");

        builder.Property(f => f.Hauptbereich)
            .HasMaxLength(1)
            .HasColumnType("char(1)")
            .HasColumnName("Hauptbereich");

        builder.Property(f => f.HauptbereichName)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("HauptbereichName");

        builder.Property(f => f.ZahlungTypId)
            .HasColumnName("ZahlungTypId");

        builder.Property(f => f.Reihenfolge)
            .HasDefaultValue(0)
            .HasColumnName("Reihenfolge");

        builder.Property(f => f.IsAktiv)
            .HasDefaultValue(true)
            .HasColumnName("IsAktiv");

        // Audit fields from AuditableEntity
        builder.Property(f => f.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(f => f.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(f => f.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(f => f.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(f => f.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Aktiv property from AuditableEntity - not used, we have IsAktiv
        builder.Ignore(f => f.Aktiv);

        // Indexes
        builder.HasIndex(f => f.Nummer)
            .IsUnique()
            .HasDatabaseName("UQ_FiBuKonto_Nummer");

        builder.HasIndex(f => f.Hauptbereich)
            .HasDatabaseName("IX_FiBuKonto_Hauptbereich");

        builder.HasIndex(f => f.Bereich)
            .HasDatabaseName("IX_FiBuKonto_Bereich");

        builder.HasIndex(f => f.Typ)
            .HasDatabaseName("IX_FiBuKonto_Typ");

        builder.HasIndex(f => f.IsAktiv)
            .HasDatabaseName("IX_FiBuKonto_IsAktiv");

        builder.HasIndex(f => f.ZahlungTypId)
            .HasDatabaseName("IX_FiBuKonto_ZahlungTypId");

        // Foreign key relationships
        builder.HasOne(f => f.ZahlungTyp)
            .WithMany()
            .HasForeignKey(f => f.ZahlungTypId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_FiBuKonto_ZahlungTyp");
    }
}

