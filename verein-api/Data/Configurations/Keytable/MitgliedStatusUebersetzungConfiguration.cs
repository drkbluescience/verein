using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class MitgliedStatusUebersetzungConfiguration : IEntityTypeConfiguration<MitgliedStatusUebersetzung>
{
    public void Configure(EntityTypeBuilder<MitgliedStatusUebersetzung> builder)
    {
        builder.ToTable("MitgliedStatusUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.MitgliedStatusId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.MitgliedStatusId, x.Sprache }).IsUnique().HasDatabaseName("IX_MitgliedStatusUebersetzung_MitgliedStatusId_Sprache_Unique");
        builder.HasOne(x => x.MitgliedStatus).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.MitgliedStatusId).OnDelete(DeleteBehavior.Cascade);
    }
}

