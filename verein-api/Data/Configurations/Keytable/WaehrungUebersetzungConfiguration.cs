using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class WaehrungUebersetzungConfiguration : IEntityTypeConfiguration<WaehrungUebersetzung>
{
    public void Configure(EntityTypeBuilder<WaehrungUebersetzung> builder)
    {
        builder.ToTable("WaehrungUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.WaehrungId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.WaehrungId, x.Sprache }).IsUnique().HasDatabaseName("IX_WaehrungUebersetzung_WaehrungId_Sprache_Unique");
        builder.HasOne(x => x.Waehrung).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.WaehrungId).OnDelete(DeleteBehavior.Cascade);
    }
}

