using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class BeitragPeriodeUebersetzungConfiguration : IEntityTypeConfiguration<BeitragPeriodeUebersetzung>
{
    public void Configure(EntityTypeBuilder<BeitragPeriodeUebersetzung> builder)
    {
        builder.ToTable("BeitragPeriodeUebersetzung", "Keytable");
        builder.HasKey(x => new { x.BeitragPeriodeCode, x.Sprache });
        builder.Property(x => x.BeitragPeriodeCode).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.Property(x => x.Sprache).IsRequired().HasMaxLength(2).HasColumnType("nvarchar(2)");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(30).HasColumnType("nvarchar(30)");
        builder.HasOne(x => x.BeitragPeriode).WithMany(x => x.Uebersetzungen).HasForeignKey(x => x.BeitragPeriodeCode).OnDelete(DeleteBehavior.Cascade);
    }
}

