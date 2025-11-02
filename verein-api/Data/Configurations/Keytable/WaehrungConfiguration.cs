using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class WaehrungConfiguration : IEntityTypeConfiguration<Waehrung>
{
    public void Configure(EntityTypeBuilder<Waehrung> builder)
    {
        builder.ToTable("Waehrung", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(10).HasColumnType("nvarchar(10)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Waehrung_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.Waehrung).HasForeignKey(x => x.WaehrungId).OnDelete(DeleteBehavior.Cascade);
    }
}

