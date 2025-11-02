using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class ZahlungTypConfiguration : IEntityTypeConfiguration<ZahlungTyp>
{
    public void Configure(EntityTypeBuilder<ZahlungTyp> builder)
    {
        builder.ToTable("ZahlungTyp", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(30).HasColumnType("nvarchar(30)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_ZahlungTyp_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.ZahlungTyp).HasForeignKey(x => x.ZahlungTypId).OnDelete(DeleteBehavior.Cascade);
    }
}

