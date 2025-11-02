using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

/// <summary>
/// Entity Framework configuration for GeschlechtUebersetzung (Gender Translation) table
/// </summary>
public class GeschlechtUebersetzungConfiguration : IEntityTypeConfiguration<GeschlechtUebersetzung>
{
    public void Configure(EntityTypeBuilder<GeschlechtUebersetzung> builder)
    {
        builder.ToTable("GeschlechtUebersetzung", "Keytable");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        builder.Property(x => x.GeschlechtId)
            .IsRequired();

        builder.Property(x => x.Sprache)
            .IsRequired()
            .HasMaxLength(2)
            .HasColumnType("nvarchar(2)");

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.HasIndex(x => new { x.GeschlechtId, x.Sprache })
            .IsUnique()
            .HasDatabaseName("IX_GeschlechtUebersetzung_GeschlechtId_Sprache_Unique");

        builder.HasOne(x => x.Geschlecht)
            .WithMany(x => x.Uebersetzungen)
            .HasForeignKey(x => x.GeschlechtId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

