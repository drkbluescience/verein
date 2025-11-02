using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class ZahlungStatusUebersetzungConfiguration : IEntityTypeConfiguration<ZahlungStatusUebersetzung>
{
    public void Configure(EntityTypeBuilder<ZahlungStatusUebersetzung> builder)
    {
        builder.ToTable("ZahlungStatusUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.ZahlungStatusId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.ZahlungStatusId, x.Sprache }).IsUnique().HasDatabaseName("IX_ZahlungStatusUebersetzung_ZahlungStatusId_Sprache_Unique");
        builder.HasOne(x => x.ZahlungStatus).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.ZahlungStatusId).OnDelete(DeleteBehavior.Cascade);
    }
}

