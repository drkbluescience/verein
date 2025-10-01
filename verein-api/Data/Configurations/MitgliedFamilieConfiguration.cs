using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for MitgliedFamilie entity
/// </summary>
public class MitgliedFamilieConfiguration : IEntityTypeConfiguration<MitgliedFamilie>
{
    public void Configure(EntityTypeBuilder<MitgliedFamilie> builder)
    {
        // Table configuration
        builder.ToTable("MitgliedFamilie", "Mitglied");

        // Primary key
        builder.HasKey(mf => mf.Id);
        builder.Property(mf => mf.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(mf => mf.VereinId)
            .IsRequired()
            .HasColumnName("VereinId");

        builder.Property(mf => mf.MitgliedId)
            .IsRequired()
            .HasColumnName("MitgliedId");

        builder.Property(mf => mf.ParentMitgliedId)
            .IsRequired()
            .HasColumnName("ParentMitgliedId");

        builder.Property(mf => mf.FamilienbeziehungTypId)
            .IsRequired()
            .HasColumnName("FamilienbeziehungTypId");

        builder.Property(mf => mf.MitgliedFamilieStatusId)
            .IsRequired()
            .HasColumnName("MitgliedFamilieStatusId")
            .HasDefaultValue(1);

        // Optional fields
        builder.Property(mf => mf.GueltigVon)
            .HasColumnType("date")
            .HasColumnName("GueltigVon");

        builder.Property(mf => mf.GueltigBis)
            .HasColumnType("date")
            .HasColumnName("GueltigBis");

        builder.Property(mf => mf.Hinweis)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Hinweis");

        // Audit fields from AuditableEntity
        builder.Property(mf => mf.Created)
            .HasColumnType("datetime")
            .HasColumnName("Created");

        builder.Property(mf => mf.CreatedBy)
            .HasColumnName("CreatedBy");

        builder.Property(mf => mf.Modified)
            .HasColumnType("datetime")
            .HasColumnName("Modified");

        builder.Property(mf => mf.ModifiedBy)
            .HasColumnName("ModifiedBy");

        builder.Property(mf => mf.DeletedFlag)
            .HasColumnName("DeletedFlag");

        builder.Property(mf => mf.Aktiv)
            .HasColumnName("Aktiv");

        // Unique constraint from SQL schema
        builder.HasIndex(mf => new { 
            mf.VereinId, 
            mf.MitgliedId, 
            mf.ParentMitgliedId, 
            mf.FamilienbeziehungTypId 
        })
        .IsUnique()
        .HasDatabaseName("UQ_MitgliedFamilie");

        // Performance indexes
        builder.HasIndex(mf => mf.VereinId)
            .HasDatabaseName("IX_MitgliedFamilie_VereinId");

        builder.HasIndex(mf => mf.MitgliedId)
            .HasDatabaseName("IX_MitgliedFamilie_MitgliedId");

        builder.HasIndex(mf => mf.ParentMitgliedId)
            .HasDatabaseName("IX_MitgliedFamilie_ParentMitgliedId");

        builder.HasIndex(mf => mf.FamilienbeziehungTypId)
            .HasDatabaseName("IX_MitgliedFamilie_FamilienbeziehungTypId");

        builder.HasIndex(mf => mf.MitgliedFamilieStatusId)
            .HasDatabaseName("IX_MitgliedFamilie_MitgliedFamilieStatusId");

        builder.HasIndex(mf => mf.DeletedFlag)
            .HasDatabaseName("IX_MitgliedFamilie_DeletedFlag");

        // Foreign key relationships
        builder.HasOne(mf => mf.Verein)
            .WithMany(v => v.MitgliedFamilien)
            .HasForeignKey(mf => mf.VereinId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_MitgliedFamilie_Verein");

        builder.HasOne(mf => mf.Mitglied)
            .WithMany(m => m.FamilienbeziehungenAlsKind)
            .HasForeignKey(mf => mf.MitgliedId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_MitgliedFamilie_Mitglied");

        builder.HasOne(mf => mf.ParentMitglied)
            .WithMany(m => m.FamilienbeziehungenAlsElternteil)
            .HasForeignKey(mf => mf.ParentMitgliedId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_MitgliedFamilie_ParentMitglied");
    }
}
