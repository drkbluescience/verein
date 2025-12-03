using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Nachricht entity
/// </summary>
public class NachrichtConfiguration : IEntityTypeConfiguration<Nachricht>
{
    public void Configure(EntityTypeBuilder<Nachricht> builder)
    {
        // Table configuration
        builder.ToTable("Nachricht", "Brief");

        // Primary key
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(n => n.BriefId)
            .IsRequired();

        builder.Property(n => n.VereinId)
            .IsRequired();

        builder.Property(n => n.MitgliedId)
            .IsRequired();

        builder.Property(n => n.Betreff)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(n => n.Inhalt)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        // Optional fields
        builder.Property(n => n.LogoUrl)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(n => n.IstGelesen)
            .HasDefaultValue(false);

        builder.Property(n => n.GelesenDatum)
            .HasColumnType("datetime");

        builder.Property(n => n.GesendetDatum)
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(n => n.DeletedFlag)
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(n => n.BriefId)
            .HasDatabaseName("IX_Nachricht_BriefId");

        builder.HasIndex(n => n.VereinId)
            .HasDatabaseName("IX_Nachricht_VereinId");

        builder.HasIndex(n => n.MitgliedId)
            .HasDatabaseName("IX_Nachricht_MitgliedId");

        builder.HasIndex(n => n.IstGelesen)
            .HasDatabaseName("IX_Nachricht_IstGelesen");

        builder.HasIndex(n => n.GesendetDatum)
            .HasDatabaseName("IX_Nachricht_GesendetDatum");

        builder.HasIndex(n => n.DeletedFlag)
            .HasDatabaseName("IX_Nachricht_DeletedFlag");

        // Composite index for member inbox
        builder.HasIndex(n => new { n.MitgliedId, n.DeletedFlag, n.GesendetDatum })
            .HasDatabaseName("IX_Nachricht_MitgliedInbox");

        // Relationships
        builder.HasOne(n => n.Brief)
            .WithMany(b => b.Nachrichten)
            .HasForeignKey(n => n.BriefId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("FK_Nachricht_Brief");

        builder.HasOne(n => n.Verein)
            .WithMany()
            .HasForeignKey(n => n.VereinId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("FK_Nachricht_Verein");

        builder.HasOne(n => n.Mitglied)
            .WithMany()
            .HasForeignKey(n => n.MitgliedId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("FK_Nachricht_Mitglied");

        // Global query filter for soft delete
        builder.HasQueryFilter(n => !n.DeletedFlag);
    }
}

