using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for VereinSatzung entity
/// </summary>
public class VereinSatzungConfiguration : IEntityTypeConfiguration<VereinSatzung>
{
    public void Configure(EntityTypeBuilder<VereinSatzung> builder)
    {
        builder.ToTable("VereinSatzung", "Verein");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedOnAdd();

        builder.Property(x => x.VereinId)
            .IsRequired();

        builder.Property(x => x.DosyaPfad)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.SatzungVom)
            .IsRequired()
            .HasColumnType("date");

        builder.Property(x => x.Aktiv)
            .IsRequired();

        builder.Property(x => x.Bemerkung)
            .HasMaxLength(500);

        builder.Property(x => x.DosyaAdi)
            .HasMaxLength(200);

        builder.Property(x => x.DosyaBoyutu);

        // Configure foreign key
        builder.HasOne(x => x.Verein)
            .WithMany()
            .HasForeignKey(x => x.VereinId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes
        builder.HasIndex(x => x.VereinId);
        builder.HasIndex(x => x.Aktiv);
        builder.HasIndex(x => x.DeletedFlag);
    }
}