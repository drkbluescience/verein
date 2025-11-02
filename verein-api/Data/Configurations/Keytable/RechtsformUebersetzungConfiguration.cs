using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class RechtsformUebersetzungConfiguration : IEntityTypeConfiguration<RechtsformUebersetzung>
{
    public void Configure(EntityTypeBuilder<RechtsformUebersetzung> builder)
    {
        builder.ToTable("RechtsformUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.RechtsformId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.RechtsformId, x.Sprache }).IsUnique().HasDatabaseName("IX_RechtsformUebersetzung_RechtsformId_Sprache_Unique");
        builder.HasOne(x => x.Rechtsform).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.RechtsformId).OnDelete(DeleteBehavior.Cascade);
    }
}

