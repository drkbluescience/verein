using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class MitgliedFamilieStatusUebersetzungConfiguration : IEntityTypeConfiguration<MitgliedFamilieStatusUebersetzung>
{
    public void Configure(EntityTypeBuilder<MitgliedFamilieStatusUebersetzung> builder)
    {
        builder.ToTable("MitgliedFamilieStatusUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.MitgliedFamilieStatusId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.MitgliedFamilieStatusId, x.Sprache }).IsUnique().HasDatabaseName("IX_MitgliedFamilieStatusUebersetzung_MitgliedFamilieStatusId_Sprache_Unique");
        builder.HasOne(x => x.MitgliedFamilieStatus).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.MitgliedFamilieStatusId).OnDelete(DeleteBehavior.Cascade);
    }
}

