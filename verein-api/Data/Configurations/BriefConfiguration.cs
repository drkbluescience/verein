using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Brief entity
/// </summary>
public class BriefConfiguration : IEntityTypeConfiguration<Brief>
{
    public void Configure(EntityTypeBuilder<Brief> builder)
    {
        // Table configuration
        builder.ToTable("Brief", "Brief");

        // Primary key
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(b => b.VereinId)
            .IsRequired();

        builder.Property(b => b.Titel)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(b => b.Betreff)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(b => b.Inhalt)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(b => b.Status)
            .IsRequired()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasDefaultValue("Entwurf");

        // Optional fields
        builder.Property(b => b.LogoUrl)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

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
            .HasDatabaseName("IX_Brief_VereinId");

        builder.HasIndex(b => b.VorlageId)
            .HasDatabaseName("IX_Brief_VorlageId");

        builder.HasIndex(b => b.Status)
            .HasDatabaseName("IX_Brief_Status");

        builder.HasIndex(b => b.DeletedFlag)
            .HasDatabaseName("IX_Brief_DeletedFlag");

        builder.HasIndex(b => b.Created)
            .HasDatabaseName("IX_Brief_Created");

        // Relationships
        builder.HasOne(b => b.Verein)
            .WithMany()
            .HasForeignKey(b => b.VereinId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("FK_Brief_Verein");

        builder.HasOne(b => b.Vorlage)
            .WithMany(v => v.Briefe)
            .HasForeignKey(b => b.VorlageId)
            .OnDelete(DeleteBehavior.NoAction)
            .HasConstraintName("FK_Brief_Vorlage");

        builder.HasMany(b => b.Nachrichten)
            .WithOne(n => n.Brief)
            .HasForeignKey(n => n.BriefId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}

