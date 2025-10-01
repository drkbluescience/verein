using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Mitglied entity
/// </summary>
public class MitgliedConfiguration : IEntityTypeConfiguration<Mitglied>
{
    public void Configure(EntityTypeBuilder<Mitglied> builder)
    {
        // Table configuration
        builder.ToTable("Mitglied", "Mitglied");

        // Primary key
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(m => m.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(m => m.Mitgliedsnummer)
            .IsRequired()
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Mitgliedsnummer");

        builder.Property(m => m.MitgliedStatusId)
            .IsRequired()
            .HasColumnName("MitgliedStatusId");

        builder.Property(m => m.MitgliedTypId)
            .IsRequired()
            .HasColumnName("MitgliedTypId");

        builder.Property(m => m.Vorname)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Vorname");

        builder.Property(m => m.Nachname)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Nachname");

        // Optional fields
        builder.Property(m => m.GeschlechtId)
            .HasColumnName("GeschlechtId");

        builder.Property(m => m.Geburtsdatum)
            .HasColumnType("date")
            .HasColumnName("Geburtsdatum");

        builder.Property(m => m.Geburtsort)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Geburtsort");

        builder.Property(m => m.StaatsangehoerigkeitId)
            .HasColumnName("StaatsangehoerigkeitId");

        builder.Property(m => m.Email)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Email");

        builder.Property(m => m.Telefon)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Telefon");

        builder.Property(m => m.Mobiltelefon)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Mobiltelefon");

        builder.Property(m => m.Eintrittsdatum)
            .HasColumnType("date")
            .HasColumnName("Eintrittsdatum");

        builder.Property(m => m.Austrittsdatum)
            .HasColumnType("date")
            .HasColumnName("Austrittsdatum");

        builder.Property(m => m.Bemerkung)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Bemerkung");

        // Beitrag (membership fee) fields
        builder.Property(m => m.BeitragBetrag)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("BeitragBetrag");

        builder.Property(m => m.BeitragWaehrungId)
            .HasColumnName("BeitragWaehrungId");

        builder.Property(m => m.BeitragPeriodeCode)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("BeitragPeriodeCode");

        builder.Property(m => m.BeitragZahlungsTag)
            .HasColumnName("BeitragZahlungsTag");

        builder.Property(m => m.BeitragZahlungstagTypCode)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("BeitragZahlungstagTypCode");

        builder.Property(m => m.BeitragIstPflicht)
            .HasColumnName("BeitragIstPflicht");

        // Audit fields from AuditableEntity
        builder.Property(m => m.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(m => m.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(m => m.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(m => m.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(m => m.DeletedFlag)
            .HasColumnName("DeletedFlag");

        builder.Property(m => m.Aktiv)
            .HasColumnName("Aktiv")
            .HasDefaultValue(true);

        // Unique constraint
        builder.HasIndex(m => m.Mitgliedsnummer)
            .IsUnique()
            .HasDatabaseName("IX_Mitglied_Mitgliedsnummer");

        // Performance indexes
        builder.HasIndex(m => m.VereinId)
            .HasDatabaseName("IX_Mitglied_VereinId");

        builder.HasIndex(m => m.MitgliedStatusId)
            .HasDatabaseName("IX_Mitglied_MitgliedStatusId");

        builder.HasIndex(m => m.MitgliedTypId)
            .HasDatabaseName("IX_Mitglied_MitgliedTypId");

        builder.HasIndex(m => m.StaatsangehoerigkeitId)
            .HasDatabaseName("IX_Mitglied_StaatsangehoerigkeitId");

        builder.HasIndex(m => m.Email)
            .HasDatabaseName("IX_Mitglied_Email");

        builder.HasIndex(m => m.DeletedFlag)
            .HasDatabaseName("IX_Mitglied_DeletedFlag");

        builder.HasIndex(m => new { m.Nachname, m.Vorname })
            .HasDatabaseName("IX_Mitglied_Name");

        // Foreign key relationships
        builder.HasOne(m => m.Verein)
            .WithMany(v => v.Mitglieder)
            .HasForeignKey(m => m.VereinId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_Mitglied_Verein");

        // Collection navigation properties
        builder.HasMany(m => m.MitgliedAdressen)
            .WithOne(ma => ma.Mitglied)
            .HasForeignKey(ma => ma.MitgliedId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(m => m.FamilienbeziehungenAlsKind)
            .WithOne(mf => mf.Mitglied)
            .HasForeignKey(mf => mf.MitgliedId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(m => m.FamilienbeziehungenAlsElternteil)
            .WithOne(mf => mf.ParentMitglied)
            .HasForeignKey(mf => mf.ParentMitgliedId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(m => m.VeranstaltungAnmeldungen)
            .WithOne(va => va.Mitglied)
            .HasForeignKey(va => va.MitgliedId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
