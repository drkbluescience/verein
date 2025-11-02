using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class MitgliedTypUebersetzungConfiguration : IEntityTypeConfiguration<MitgliedTypUebersetzung>
{
    public void Configure(EntityTypeBuilder<MitgliedTypUebersetzung> builder)
    {
        builder.ToTable("MitgliedTypUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.MitgliedTypId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
        builder.HasIndex(x => new { x.MitgliedTypId, x.Sprache }).IsUnique().HasDatabaseName("IX_MitgliedTypUebersetzung_MitgliedTypId_Sprache_Unique");
        builder.HasOne(x => x.MitgliedTyp).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.MitgliedTypId).OnDelete(DeleteBehavior.Cascade);
    }
}

