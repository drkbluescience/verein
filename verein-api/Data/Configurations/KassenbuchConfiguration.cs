using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Kassenbuch (Cash Book) entity
/// </summary>
public class KassenbuchConfiguration : IEntityTypeConfiguration<Kassenbuch>
{
    public void Configure(EntityTypeBuilder<Kassenbuch> builder)
    {
        // Table configuration
        builder.ToTable("Kassenbuch", "Finanz");

        // Primary key
        builder.HasKey(k => k.Id);
        builder.Property(k => k.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(k => k.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(k => k.BelegNr)
            .IsRequired()
            .HasColumnName("BelegNr");

        builder.Property(k => k.BelegDatum)
            .IsRequired()
            .HasColumnType("date")
            .HasColumnName("BelegDatum");

        builder.Property(k => k.FiBuNummer)
            .IsRequired()
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)")
            .HasColumnName("FiBuNummer");

        builder.Property(k => k.Jahr)
            .IsRequired()
            .HasColumnName("Jahr");

        // Optional fields
        builder.Property(k => k.Verwendungszweck)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Verwendungszweck");

        builder.Property(k => k.EinnahmeKasse)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("EinnahmeKasse");

        builder.Property(k => k.AusgabeKasse)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("AusgabeKasse");

        builder.Property(k => k.EinnahmeBank)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("EinnahmeBank");

        builder.Property(k => k.AusgabeBank)
            .HasColumnType("decimal(18,2)")
            .HasColumnName("AusgabeBank");

        builder.Property(k => k.Zahlungsweg)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("Zahlungsweg");

        builder.Property(k => k.Bemerkung)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)")
            .HasColumnName("Bemerkung");

        builder.Property(k => k.MitgliedId)
            .HasColumnName("MitgliedId");

        builder.Property(k => k.MitgliedZahlungId)
            .HasColumnName("MitgliedZahlungId");

        builder.Property(k => k.BankBuchungId)
            .HasColumnName("BankBuchungId");

        // Audit fields
        builder.Property(k => k.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(k => k.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(k => k.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(k => k.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(k => k.DeletedFlag)
            .HasColumnName("DeletedFlag");

        // Ignore Aktiv from AuditableEntity - we don't use it
        builder.Ignore(k => k.Aktiv);

        // Indexes
        builder.HasIndex(k => new { k.VereinId, k.Jahr })
            .HasDatabaseName("IX_Kassenbuch_VereinJahr");

        builder.HasIndex(k => k.FiBuNummer)
            .HasDatabaseName("IX_Kassenbuch_FiBuNummer");

        builder.HasIndex(k => new { k.VereinId, k.Jahr, k.BelegNr })
            .IsUnique()
            .HasDatabaseName("UQ_Kassenbuch_BelegNr");

        builder.HasIndex(k => k.BelegDatum)
            .HasDatabaseName("IX_Kassenbuch_BelegDatum");

        builder.HasIndex(k => k.MitgliedId)
            .HasDatabaseName("IX_Kassenbuch_MitgliedId");

        builder.HasIndex(k => k.DeletedFlag)
            .HasDatabaseName("IX_Kassenbuch_DeletedFlag");

        // Foreign key relationships
        builder.HasOne(k => k.Verein)
            .WithMany()
            .HasForeignKey(k => k.VereinId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Kassenbuch_Verein");

        builder.HasOne(k => k.FiBuKonto)
            .WithMany(f => f.Kassenbuchungen)
            .HasForeignKey(k => k.FiBuNummer)
            .HasPrincipalKey(f => f.Nummer)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Kassenbuch_FiBuKonto");

        builder.HasOne(k => k.Mitglied)
            .WithMany()
            .HasForeignKey(k => k.MitgliedId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Kassenbuch_Mitglied");

        builder.HasOne(k => k.MitgliedZahlung)
            .WithMany()
            .HasForeignKey(k => k.MitgliedZahlungId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Kassenbuch_MitgliedZahlung");

        builder.HasOne(k => k.BankBuchung)
            .WithMany()
            .HasForeignKey(k => k.BankBuchungId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Kassenbuch_BankBuchung");
    }
}

