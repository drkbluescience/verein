using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class StaatsangehoerigkeitConfiguration : IEntityTypeConfiguration<Staatsangehoerigkeit>
{
    public void Configure(EntityTypeBuilder<Staatsangehoerigkeit> builder)
    {
        builder.ToTable("Staatsangehoerigkeit", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Iso2).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Iso3).IsRequired().HasMaxLength(3).HasColumnType("nvarchar(3)");
        builder.HasIndex(x => x.Iso2).IsUnique().HasDatabaseName("IX_Staatsangehoerigkeit_Iso2_Unique");
        builder.HasIndex(x => x.Iso3).IsUnique().HasDatabaseName("IX_Staatsangehoerigkeit_Iso3_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.Staatsangehoerigkeit).HasForeignKey(x => x.StaatsangehoerigkeitId).OnDelete(DeleteBehavior.Cascade);
    }
}

