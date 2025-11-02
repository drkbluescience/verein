using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities.Keytable;

namespace VereinsApi.Data.Configurations.Keytable;

/// <summary>
/// Entity Framework configuration for Geschlecht (Gender) lookup table
/// </summary>
public class GeschlechtConfiguration : IEntityTypeConfiguration<Geschlecht>
{
    public void Configure(EntityTypeBuilder<Geschlecht> builder)
    {
        builder.ToTable("Geschlecht", "Keytable");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(10)
            .HasColumnType("nvarchar(10)");

        builder.HasIndex(x => x.Code)
            .IsUnique()
            .HasDatabaseName("IX_Geschlecht_Code_Unique");

        builder.HasMany(x => x.Uebersetzungen)
            .WithOne(x => x.Geschlecht)
            .HasForeignKey(x => x.GeschlechtId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

