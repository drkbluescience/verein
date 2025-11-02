using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class BeitragZahlungstagTypConfiguration : IEntityTypeConfiguration<BeitragZahlungstagTyp>
{
    public void Configure(EntityTypeBuilder<BeitragZahlungstagTyp> builder)
    {
        builder.ToTable("BeitragZahlungstagTyp", "Keytable");
        builder.HasKey(x => x.Code);
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.Property(x => x.Sort).IsRequired();
        builder.HasIndex(x => x.Sort).HasDatabaseName("IX_BeitragZahlungstagTyp_Sort");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.BeitragZahlungstagTyp).HasForeignKey(x => x.Code).OnDelete(DeleteBehavior.Cascade);
    }
}

