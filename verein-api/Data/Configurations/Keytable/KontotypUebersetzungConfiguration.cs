using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class KontotypUebersetzungConfiguration : IEntityTypeConfiguration<KontotypUebersetzung>
{
    public void Configure(EntityTypeBuilder<KontotypUebersetzung> builder)
    {
        builder.ToTable("KontotypUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.KontotypId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.KontotypId, x.Sprache }).IsUnique().HasDatabaseName("IX_KontotypUebersetzung_KontotypId_Sprache_Unique");
        builder.HasOne(x => x.Kontotyp).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.KontotypId).OnDelete(DeleteBehavior.Cascade);
    }
}

