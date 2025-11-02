using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class ForderungsstatusConfiguration : IEntityTypeConfiguration<Forderungsstatus>
{
    public void Configure(EntityTypeBuilder<Forderungsstatus> builder)
    {
        builder.ToTable("Forderungsstatus", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Forderungsstatus_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.Forderungsstatus).HasForeignKey(x => x.ForderungsstatusId).OnDelete(DeleteBehavior.Cascade);
    }
}

