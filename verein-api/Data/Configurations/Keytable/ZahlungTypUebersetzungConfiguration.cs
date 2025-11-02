using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class ZahlungTypUebersetzungConfiguration : IEntityTypeConfiguration<ZahlungTypUebersetzung>
{
    public void Configure(EntityTypeBuilder<ZahlungTypUebersetzung> builder)
    {
        builder.ToTable("ZahlungTypUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.ZahlungTypId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.ZahlungTypId, x.Sprache }).IsUnique().HasDatabaseName("IX_ZahlungTypUebersetzung_ZahlungTypId_Sprache_Unique");
        builder.HasOne(x => x.ZahlungTyp).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.ZahlungTypId).OnDelete(DeleteBehavior.Cascade);
    }
}

