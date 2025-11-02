using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

public class FamilienbeziehungTypConfiguration : IEntityTypeConfiguration<FamilienbeziehungTyp>
{
    public void Configure(EntityTypeBuilder<FamilienbeziehungTyp> builder)
    {
        builder.ToTable("FamilienbeziehungTyp", "Keytable");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd().HasAnnotation("SqlServer:Identity", "1, 1");
        builder.Property(x => x.Code).IsRequired().HasMaxLength(20).HasColumnType("nvarchar(20)");
        builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_FamilienbeziehungTyp_Code_Unique");
        builder.HasMany(x => x.Uebersetzungen).WithOne(x => x.FamilienbeziehungTyp).HasForeignKey(x => x.FamilienbeziehungTypId).OnDelete(DeleteBehavior.Cascade);
    }
}

