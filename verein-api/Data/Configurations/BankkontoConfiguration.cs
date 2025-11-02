using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Bankkonto entity
/// </summary>
public class BankkontoConfiguration : IEntityTypeConfiguration<Bankkonto>
{
    public void Configure(EntityTypeBuilder<Bankkonto> builder)
    {
        // Table configuration - Almanca tablo adı kullan
        builder.ToTable("Bankkonto", "Verein");

        // Primary key
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(b => b.VereinId)
            .IsRequired();

        builder.Property(b => b.IBAN)
            .IsRequired()
            .HasMaxLength(34)
            .HasColumnType("nvarchar(34)")
            .HasColumnName("IBAN");

        // Optional string fields with specific lengths - Almanca kolon isimleri
        builder.Property(b => b.BIC)
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)")
            .HasColumnName("BIC");

        builder.Property(b => b.Kontoinhaber)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Kontoinhaber");

        builder.Property(b => b.Bankname)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)")
            .HasColumnName("Bankname");

        builder.Property(b => b.KontoNr)
            .HasMaxLength(30)
            .HasColumnType("nvarchar(30)")
            .HasColumnName("KontoNr");

        builder.Property(b => b.BLZ)
            .HasMaxLength(15)
            .HasColumnType("nvarchar(15)")
            .HasColumnName("BLZ");

        builder.Property(b => b.Beschreibung)
            .HasMaxLength(250)
            .HasColumnType("nvarchar(250)")
            .HasColumnName("Beschreibung");

        // Date fields - Almanca kolon isimleri
        builder.Property(b => b.GueltigVon)
            .HasColumnType("date")
            .HasColumnName("GueltigVon");

        builder.Property(b => b.GueltigBis)
            .HasColumnType("date")
            .HasColumnName("GueltigBis");

        // Boolean fields
        builder.Property(b => b.IstStandard)
            .HasColumnName("IstStandard");

        // Audit fields from AuditableEntity - Almanca kolon isimleri ve datetime tipi
        builder.Property(b => b.Created)
            .IsRequired()
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETDATE()");

        builder.Property(b => b.Modified)
            .HasColumnType("datetime");

        builder.Property(b => b.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false)
            .HasColumnName("DeletedFlag");

        builder.Property(b => b.Aktiv)
            .HasColumnName("Aktiv");

        // Indexes for performance
        builder.HasIndex(b => b.VereinId)
            .HasDatabaseName("IX_Bankkonto_VereinId");

        builder.HasIndex(b => b.IBAN)
            .IsUnique()
            .HasDatabaseName("IX_Bankkonto_IBAN");

        builder.HasIndex(b => b.DeletedFlag)
            .HasDatabaseName("IX_Bankkonto_DeletedFlag");

        builder.HasIndex(b => b.IstStandard)
            .HasDatabaseName("IX_Bankkonto_IstStandard");

        // Foreign key relationships
        builder.Property(b => b.KontotypId)
            .HasColumnName("KontotypId");

        builder.HasOne(b => b.Verein)
            .WithMany(v => v.Bankkonten)
            .HasForeignKey(b => b.VereinId)
            .OnDelete(DeleteBehavior.Restrict); // NO ACTION - cascade cycle önleme
    }
}
