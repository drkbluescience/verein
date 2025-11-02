using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class StaatsangehoerigkeitUebersetzungConfiguration : IEntityTypeConfiguration<StaatsangehoerigkeitUebersetzung>
{
    public void Configure(EntityTypeBuilder<StaatsangehoerigkeitUebersetzung> builder)
    {
        builder.ToTable("StaatsangehoerigkeitUebersetzung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.StaatsangehoerigkeitId).IsRequired();
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
        builder.HasIndex(x => new { x.StaatsangehoerigkeitId, x.Sprache }).IsUnique().HasDatabaseName("IX_StaatsangehoerigkeitUebersetzung_StaatsangehoerigkeitId_Sprache_Unique");
        builder.HasOne(x => x.Staatsangehoerigkeit).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.StaatsangehoerigkeitId).OnDelete(DeleteBehavior.Cascade);
    }
}

