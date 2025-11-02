using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class BeitragZahlungstagTypUebersetzungConfiguration : IEntityTypeConfiguration<BeitragZahlungstagTypUebersetzung>
{
    public void Configure(EntityTypeBuilder<BeitragZahlungstagTypUebersetzung> builder)
    {
        builder.ToTable("BeitragZahlungstagTypUebersetzung", "Keytable");
        builder.HasKey(x => new { x.Code, x.Sprache });
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(30).HasColumnType("nvarchar(30)");
        builder.HasOne(x => x.BeitragZahlungstagTyp).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.Code).OnDelete(DeleteBehavior.Cascade);
    }
}

