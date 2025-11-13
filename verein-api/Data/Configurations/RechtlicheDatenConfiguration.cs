using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for RechtlicheDaten entity
/// </summary>
public class RechtlicheDatenConfiguration : IEntityTypeConfiguration<RechtlicheDaten>
{
    public void Configure(EntityTypeBuilder<RechtlicheDaten> builder)
    {
        builder.ToTable("RechtlicheDaten", "Verein");

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Foreign key
        builder.Property(r => r.VereinId).IsRequired();

        // Registergericht fields
        builder.Property(r => r.RegistergerichtName)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(r => r.RegistergerichtNummer)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(r => r.RegistergerichtOrt)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        builder.Property(r => r.RegistergerichtEintragungsdatum)
            .HasColumnType("date");

        // Finanzamt fields
        builder.Property(r => r.FinanzamtName)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(r => r.FinanzamtNummer)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(r => r.FinanzamtOrt)
            .HasMaxLength(100)
            .HasColumnType("nvarchar(100)");

        // Tax status fields
        builder.Property(r => r.Steuerpflichtig).HasColumnType("bit");
        builder.Property(r => r.Steuerbefreit).HasColumnType("bit");
        builder.Property(r => r.GemeinnuetzigAnerkannt).HasColumnType("bit");
        
        builder.Property(r => r.GemeinnuetzigkeitBis)
            .HasColumnType("date");

        // Document paths
        builder.Property(r => r.SteuererklaerungPfad)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(r => r.SteuererklaerungJahr).HasColumnType("int");

        builder.Property(r => r.SteuerbefreiungPfad)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(r => r.GemeinnuetzigkeitsbescheidPfad)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(r => r.RegisterauszugPfad)
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        // Notes
        builder.Property(r => r.Bemerkung)
            .HasMaxLength(1000)
            .HasColumnType("nvarchar(1000)");

        // Audit fields
        builder.Property(r => r.Created).HasColumnType("datetime");
        builder.Property(r => r.Modified).HasColumnType("datetime");
        builder.Property(r => r.DeletedFlag).HasColumnType("bit").HasDefaultValue(false);

        // Ignore Aktiv property - not in database table
        builder.Ignore(r => r.Aktiv);

        // Relationship is configured in VereinConfiguration.cs to avoid duplication

        // Indexes
        builder.HasIndex(r => r.VereinId)
            .IsUnique()
            .HasFilter("[DeletedFlag] = 0")
            .HasDatabaseName("IX_RechtlicheDaten_VereinId_Unique");
    }
}

