using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class KontotypConfiguration : IEntityTypeConfiguration<Kontotyp>
{
    public void Configure(EntityTypeBuilder<Kontotyp> builder)
    {
        builder.ToTable("Kontotyp", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Kontotyp_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.Kontotyp).HasForeignKey(x => x.KontotypId).OnDelete(DeleteBehavior.Cascade);
    }
}

