using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class ForderungsartUebersetzungConfiguration : IEntityTypeConfiguration<ForderungsartUebersetzung>
{
    public void Configure(EntityTypeBuilder<ForderungsartUebersetzung> builder)
    {
        builder.ToTable("ForderungsartUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.ForderungsartId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.ForderungsartId, x.Sprache }).IsUnique().HasDatabaseName("IX_ForderungsartUebersetzung_ForderungsartId_Sprache_Unique");
        builder.HasOne(x => x.Forderungsart).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.ForderungsartId).OnDelete(DeleteBehavior.Cascade);
    }
}

