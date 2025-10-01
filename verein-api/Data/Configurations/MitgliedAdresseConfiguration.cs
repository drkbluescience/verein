using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for MitgliedAdresse entity
/// </summary>
public class MitgliedAdresseConfiguration : IEntityTypeConfiguration<MitgliedAdresse>
{
    public void Configure(EntityTypeBuilder<MitgliedAdresse> builder)
    {
        // Table configuration
        builder.ToTable("MitgliedAdresse", "Mitglied");

        // Primary key
        builder.HasKey(ma => ma.Id);
        builder.Property(ma => ma.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(ma => ma.MitgliedId)
            .IsRequired()
            .HasColumnName("MitgliedId");

        builder.Property(ma => ma.AdresseTypId)
            .IsRequired()
            .HasColumnName("AdresseTypId");

        // Optional string fields with specific lengths
        builder.Property(ma => ma.Strasse)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Strasse");

        builder.Property(ma => ma.Hausnummer)
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("Hausnummer");

        builder.Property(ma => ma.Adresszusatz)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Adresszusatz");

        builder.Property(ma => ma.PLZ)
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("PLZ");

        builder.Property(ma => ma.Ort)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Ort");

        builder.Property(ma => ma.Stadtteil)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Stadtteil");

        builder.Property(ma => ma.Bundesland)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Bundesland");

        builder.Property(ma => ma.Land)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasColumnName("Land");

        builder.Property(ma => ma.Postfach)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Postfach");

        builder.Property(ma => ma.Telefonnummer)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Telefonnummer");

        builder.Property(ma => ma.EMail)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("EMail");

        builder.Property(ma => ma.Hinweis)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Hinweis");

        // Float fields for GPS coordinates (SQL uses float type)
        builder.Property(ma => ma.Latitude)
            .HasColumnType("float")
            .HasColumnName("Latitude");

        builder.Property(ma => ma.Longitude)
            .HasColumnType("float")
            .HasColumnName("Longitude");

        // Date fields
        builder.Property(ma => ma.GueltigVon)
            .HasColumnType("date")
            .HasColumnName("GueltigVon");

        builder.Property(ma => ma.GueltigBis)
            .HasColumnType("date")
            .HasColumnName("GueltigBis");

        // Boolean fields
        builder.Property(ma => ma.IstStandard)
            .HasColumnName("IstStandard")
            .HasDefaultValue(false);

        // Audit fields from AuditableEntity
        builder.Property(ma => ma.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(ma => ma.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(ma => ma.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(ma => ma.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(ma => ma.DeletedFlag)
            .HasColumnName("DeletedFlag");

        builder.Property(ma => ma.Aktiv)
            .HasColumnName("Aktiv")
            .HasDefaultValue(true);

        // Performance indexes
        builder.HasIndex(ma => ma.MitgliedId)
            .HasDatabaseName("IX_MitgliedAdresse_MitgliedId");

        builder.HasIndex(ma => ma.AdresseTypId)
            .HasDatabaseName("IX_MitgliedAdresse_AdresseTypId");

        builder.HasIndex(ma => ma.PLZ)
            .HasDatabaseName("IX_MitgliedAdresse_PLZ");

        builder.HasIndex(ma => ma.Ort)
            .HasDatabaseName("IX_MitgliedAdresse_Ort");

        builder.HasIndex(ma => ma.IstStandard)
            .HasDatabaseName("IX_MitgliedAdresse_IstStandard");

        builder.HasIndex(ma => ma.DeletedFlag)
            .HasDatabaseName("IX_MitgliedAdresse_DeletedFlag");

        builder.HasIndex(ma => new { ma.MitgliedId, ma.IstStandard })
            .HasDatabaseName("IX_MitgliedAdresse_MitgliedId_IstStandard");

        // Foreign key relationships
        builder.HasOne(ma => ma.Mitglied)
            .WithMany(m => m.MitgliedAdressen)
            .HasForeignKey(ma => ma.MitgliedId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_MitgliedAdresse_Mitglied");
    }
}
