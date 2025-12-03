using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for BriefVorlage entity
/// </summary>
public class BriefVorlageConfiguration : IEntityTypeConfiguration<BriefVorlage>
{
    public void Configure(EntityTypeBuilder<BriefVorlage> builder)
    {
        // Table configuration
        builder.ToTable("BriefVorlage", "Brief");

        // Primary key
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(b => b.VereinId)
            .IsRequired();

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(150)
            .HasColumnType("nvarchar(150)");

        builder.Property(b => b.Betreff)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(b => b.Inhalt)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        // Optional fields
        builder.Property(b => b.Beschreibung)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(b => b.Kategorie)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(b => b.LogoPosition)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasDefaultValue("top");

        builder.Property(b => b.Schriftart)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)")
            .HasDefaultValue("Arial");

        builder.Property(b => b.Schriftgroesse)
            .HasDefaultValue(14);

        builder.Property(b => b.IstSystemvorlage)
            .HasDefaultValue(false);

        builder.Property(b => b.IstAktiv)
            .HasDefaultValue(true);

        // Audit fields
        builder.Property(b => b.Created)
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(b => b.Modified)
            .HasColumnType("datetime");

        builder.Property(b => b.DeletedFlag)
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(b => b.VereinId)
            .HasDatabaseName("IX_BriefVorlage_VereinId");

        builder.HasIndex(b => b.Kategorie)
            .HasDatabaseName("IX_BriefVorlage_Kategorie");

        builder.HasIndex(b => b.IstAktiv)
            .HasDatabaseName("IX_BriefVorlage_IstAktiv");

        builder.HasIndex(b => b.DeletedFlag)
            .HasDatabaseName("IX_BriefVorlage_DeletedFlag");

        // Relationships
        builder.HasOne(b => b.Verein)
            .WithMany()
            .HasForeignKey(b => b.VereinId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_BriefVorlage_Verein");

        builder.HasMany(b => b.Briefe)
            .WithOne(br => br.Vorlage)
            .HasForeignKey(br => br.VorlageId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

