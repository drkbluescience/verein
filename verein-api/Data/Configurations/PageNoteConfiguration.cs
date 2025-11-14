using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VereinsApi.Domain.Entities;
using VereinsApi.Domain.Enums;

namespace VereinsApi.Data.Configurations;

/// <summary>
/// Entity Framework configuration for PageNote entity
/// </summary>
public class PageNoteConfiguration : IEntityTypeConfiguration<PageNote>
{
    public void Configure(EntityTypeBuilder<PageNote> builder)
    {
        // Table configuration
        builder.ToTable("PageNote", "Web");

        // Primary key
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .ValueGeneratedOnAdd()
            .HasAnnotation("SqlServer:Identity", "1, 1");

        // Required fields
        builder.Property(p => p.PageUrl)
            .IsRequired()
            .HasMaxLength(500)
            .HasColumnType("nvarchar(500)");

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(p => p.Content)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(p => p.UserEmail)
            .IsRequired()
            .HasMaxLength(256)
            .HasColumnType("nvarchar(256)");

        // Optional string fields
        builder.Property(p => p.PageTitle)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(p => p.EntityType)
            .HasMaxLength(50)
            .HasColumnType("nvarchar(50)");

        builder.Property(p => p.UserName)
            .HasMaxLength(200)
            .HasColumnType("nvarchar(200)");

        builder.Property(p => p.CompletedBy)
            .HasMaxLength(256)
            .HasColumnType("nvarchar(256)");

        builder.Property(p => p.AdminNotes)
            .HasColumnType("nvarchar(max)");

        // Enum fields - stored as strings for readability
        builder.Property(p => p.Category)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        builder.Property(p => p.Priority)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        builder.Property(p => p.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasColumnType("nvarchar(20)");

        // DateTime fields
        builder.Property(p => p.CompletedAt)
            .HasColumnType("datetime");

        builder.Property(p => p.Created)
            .HasColumnType("datetime")
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(p => p.Modified)
            .HasColumnType("datetime");

        // Audit fields
        builder.Property(p => p.DeletedFlag)
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes for performance
        builder.HasIndex(p => p.UserEmail)
            .HasDatabaseName("IX_PageNote_UserEmail");

        builder.HasIndex(p => p.Status)
            .HasDatabaseName("IX_PageNote_Status");

        builder.HasIndex(p => new { p.EntityType, p.EntityId })
            .HasDatabaseName("IX_PageNote_EntityType_EntityId");

        builder.HasIndex(p => p.PageUrl)
            .HasDatabaseName("IX_PageNote_PageUrl");

        builder.HasIndex(p => p.DeletedFlag)
            .HasDatabaseName("IX_PageNote_DeletedFlag");

        builder.HasIndex(p => p.Category)
            .HasDatabaseName("IX_PageNote_Category");

        builder.HasIndex(p => p.Priority)
            .HasDatabaseName("IX_PageNote_Priority");

        builder.HasIndex(p => p.Created)
            .HasDatabaseName("IX_PageNote_Created");
    }
}

