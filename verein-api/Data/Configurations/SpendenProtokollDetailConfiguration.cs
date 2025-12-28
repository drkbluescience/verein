using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for SpendenProtokollDetail entity
/// </summary>
public class SpendenProtokollDetailConfiguration : IEntityTypeConfiguration<SpendenProtokollDetail>
{
    public void Configure(EntityTypeBuilder<SpendenProtokollDetail> builder)
    {
        // Table configuration
        builder.ToTable("SpendenProtokollDetail", "Finanz");

        // Primary key
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(d => d.SpendenProtokollId)
            .IsRequired()
            .HasColumnName("SpendenProtokollId");

        builder.Property(d => d.Wert)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Wert");

        builder.Property(d => d.Anzahl)
            .IsRequired()
            .HasColumnName("Anzahl");

        builder.Property(d => d.Summe)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasColumnName("Summe");

        // Indexes
        builder.HasIndex(d => d.SpendenProtokollId)
            .HasDatabaseName("IX_SpendenProtokollDetail_SpendenProtokollId");

        builder.HasIndex(d => d.Wert)
            .HasDatabaseName("IX_SpendenProtokollDetail_Wert");

        // Foreign key relationships (CASCADE DELETE)
        builder.HasOne(d => d.SpendenProtokoll)
            .WithMany(s => s.Details)
            .HasForeignKey(d => d.SpendenProtokollId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_SpendenProtokollDetail_SpendenProtokoll");
    }
}

