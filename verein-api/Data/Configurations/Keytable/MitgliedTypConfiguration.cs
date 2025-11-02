using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class MitgliedTypConfiguration : IEntityTypeConfiguration<MitgliedTyp>
{
    public void Configure(EntityTypeBuilder<MitgliedTyp> builder)
    {
        builder.ToTable("MitgliedTyp", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_MitgliedTyp_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.MitgliedTyp).HasForeignKey(x => x.MitgliedTypId).OnDelete(DeleteBehavior.Cascade);
    }
}

