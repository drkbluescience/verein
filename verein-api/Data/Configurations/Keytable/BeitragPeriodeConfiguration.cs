using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class BeitragPeriodeConfiguration : IEntityTypeConfiguration<BeitragPeriode>
{
    public void Configure(EntityTypeBuilder<BeitragPeriode> builder)
    {
        builder.ToTable("BeitragPeriode", "Keytable");
        builder.HasKey(x => x.Code);
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.Property(x => x.Sort).IsRequired();
        builder.HasIndex(x => x.Sort).HasDatabaseName("IX_BeitragPeriode_Sort");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.BeitragPeriode).HasForeignKey(x => x.BeitragPeriodeCode).OnDelete(DeleteBehavior.Cascade);
    }
}

