using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class ForderungsstatusUebersetzungConfiguration : IEntityTypeConfiguration<ForderungsstatusUebersetzung>
{
    public void Configure(EntityTypeBuilder<ForderungsstatusUebersetzung> builder)
    {
        builder.ToTable("ForderungsstatusUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.ForderungsstatusId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.ForderungsstatusId, x.Sprache }).IsUnique().HasDatabaseName("IX_ForderungsstatusUebersetzung_ForderungsstatusId_Sprache_Unique");
        builder.HasOne(x => x.Forderungsstatus).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.ForderungsstatusId).OnDelete(DeleteBehavior.Cascade);
    }
}

