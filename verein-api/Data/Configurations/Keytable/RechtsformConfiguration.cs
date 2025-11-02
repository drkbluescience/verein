using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class RechtsformConfiguration : IEntityTypeConfiguration<Rechtsform>
{
    public void Configure(EntityTypeBuilder<Rechtsform> builder)
    {
        builder.ToTable("Rechtsform", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Rechtsform_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.Rechtsform).HasForeignKey(x => x.RechtsformId).OnDelete(DeleteBehavior.Cascade);
    }
}

