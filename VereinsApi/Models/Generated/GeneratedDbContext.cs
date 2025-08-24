using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VereinsApi.Models.Generated;

public partial class GeneratedDbContext : DbContext
{
    public GeneratedDbContext()
    {
    }

    public GeneratedDbContext(DbContextOptions<GeneratedDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Association> Associations { get; set; }

    public virtual DbSet<AssociationMember> AssociationMembers { get; set; }

    public virtual DbSet<BankAccount> BankAccounts { get; set; }

    public virtual DbSet<EfmigrationsLock> EfmigrationsLocks { get; set; }

    public virtual DbSet<LegalForm> LegalForms { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=verein_dev.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.ToTable("Address");

            entity.Property(e => e.Country).HasDefaultValue("Deutschland");
            entity.Property(e => e.Created)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("DATETIME");
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.Modified).HasColumnType("DATETIME");
        });

        modelBuilder.Entity<Association>(entity =>
        {
            entity.ToTable("Association");

            entity.HasIndex(e => e.AssociationNumber, "IX_Association_AssociationNumber");

            entity.HasIndex(e => e.ClientCode, "IX_Association_ClientCode");

            entity.HasIndex(e => e.IsActive, "IX_Association_IsActive");

            entity.HasIndex(e => e.IsDeleted, "IX_Association_IsDeleted");

            entity.HasIndex(e => e.Name, "IX_Association_Name");

            entity.Property(e => e.Created)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("DATETIME");
            entity.Property(e => e.EpostReceiveAddress).HasColumnName("EPostReceiveAddress");
            entity.Property(e => e.FoundingDate).HasColumnType("DATE");
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.Modified).HasColumnType("DATETIME");
            entity.Property(e => e.SepacreditorId).HasColumnName("SEPACreditorId");
            entity.Property(e => e.Vatnumber).HasColumnName("VATNumber");

            entity.HasOne(d => d.LegalForm).WithMany(p => p.Associations).HasForeignKey(d => d.LegalFormId);

            entity.HasOne(d => d.MainAddress).WithMany(p => p.Associations).HasForeignKey(d => d.MainAddressId);

            entity.HasOne(d => d.MainBankAccount).WithMany(p => p.Associations).HasForeignKey(d => d.MainBankAccountId);
        });

        modelBuilder.Entity<AssociationMember>(entity =>
        {
            entity.ToTable("AssociationMember");

            entity.HasIndex(e => new { e.AssociationId, e.MemberId }, "IX_AssociationMember_AssociationId_MemberId").IsUnique();

            entity.HasIndex(e => e.AssociationId, "IX_AssociationMember_AssociationId");

            entity.HasIndex(e => e.MemberId, "IX_AssociationMember_MemberId");

            entity.Property(e => e.Created)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("DATETIME");
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.JoinDate).HasColumnType("DATE");
            entity.Property(e => e.LeaveDate).HasColumnType("DATE");
            entity.Property(e => e.Modified).HasColumnType("DATETIME");

            entity.HasOne(d => d.Association).WithMany(p => p.AssociationMembers)
                .HasForeignKey(d => d.AssociationId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Member).WithMany(p => p.AssociationMembers)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<BankAccount>(entity =>
        {
            entity.ToTable("BankAccount");

            entity.Property(e => e.Bic).HasColumnName("BIC");
            entity.Property(e => e.Created)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("DATETIME");
            entity.Property(e => e.Iban).HasColumnName("IBAN");
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.Modified).HasColumnType("DATETIME");
        });

        modelBuilder.Entity<EfmigrationsLock>(entity =>
        {
            entity.ToTable("__EFMigrationsLock");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<LegalForm>(entity =>
        {
            entity.ToTable("LegalForm");

            entity.Property(e => e.Created)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("DATETIME");
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.Modified).HasColumnType("DATETIME");
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.ToTable("Member");

            entity.HasIndex(e => e.Email, "IX_Member_Email");

            entity.HasIndex(e => e.LastName, "IX_Member_LastName");

            entity.HasIndex(e => e.MemberNumber, "IX_Member_MemberNumber");

            entity.Property(e => e.Created)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("DATETIME");
            entity.Property(e => e.DateOfBirth).HasColumnType("DATE");
            entity.Property(e => e.IsActive).HasDefaultValue(1);
            entity.Property(e => e.JoinDate).HasColumnType("DATE");
            entity.Property(e => e.Modified).HasColumnType("DATETIME");
            entity.Property(e => e.Status).HasDefaultValue("Active");

            entity.HasOne(d => d.Address).WithMany(p => p.Members).HasForeignKey(d => d.AddressId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
