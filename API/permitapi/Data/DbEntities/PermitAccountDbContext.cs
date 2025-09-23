using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Data.DbEntities;

public partial class PermitAccountDbContext : DbContext
{
    public PermitAccountDbContext()
    {
    }

    public PermitAccountDbContext(DbContextOptions<PermitAccountDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CityMaster> CityMasters { get; set; }

    public virtual DbSet<PermitDetail> PermitDetails { get; set; }

    public virtual DbSet<PermitMaster> PermitMasters { get; set; }

    public virtual DbSet<PermitMatrix> PermitMatrices { get; set; }

    public virtual DbSet<RegulatoryAgencyMaster> RegulatoryAgencyMasters { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)

    {
      if (!optionsBuilder.IsConfigured)
    {
        // Do nothing → will use DI connection string
    }
} 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CityMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__city_mas__3213E83F3E37AB9F");

            entity.ToTable("city_master", "guest");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.City)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("country");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.State)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("state");
        });

        modelBuilder.Entity<PermitDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__permit_d__3213E83F2B08B2DF");

            entity.ToTable("permit_details", "guest");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AdditionalBasic)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("additional_basic");
            entity.Property(e => e.AgencyReviewTimeMax).HasColumnName("agency_review_time_max");
            entity.Property(e => e.AgencyReviewTimeMin).HasColumnName("agency_review_time_min");
            entity.Property(e => e.BasicFees)
                .HasColumnType("decimal(8, 3)")
                .HasColumnName("basic_fees");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.PermitId).HasColumnName("permit_id");
            entity.Property(e => e.PrepTimeMax).HasColumnName("prep_time_max");
            entity.Property(e => e.PrepTimeMin).HasColumnName("prep_time_min");
            entity.Property(e => e.Threshold)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("threshold");
        });

        modelBuilder.Entity<PermitMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__permit_m__3213E83F94B94AEF");

            entity.ToTable("permit_master", "guest");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Category)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.City)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.County)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("county");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.Level)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("level");
            entity.Property(e => e.PermitName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("permit_name");
            entity.Property(e => e.RegulatoryAgencyId).HasColumnName("regulatory_agency_id");
            entity.Property(e => e.RegulatoryAgencyName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("regulatory_agency_name");
            entity.Property(e => e.State)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("state");
            entity.Property(e => e.TypeOfProject)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("type_of_project");
        });

        modelBuilder.Entity<PermitMatrix>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__permit_m__3213E83F07B0ED05");

            entity.ToTable("permit_matrix", "guest");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.MatrixName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("matrix_name");
            entity.Property(e => e.PermitList)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("permit_list");
            entity.Property(e => e.TypeOfProject)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("type_of_project");
        });

        modelBuilder.Entity<RegulatoryAgencyMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__regulato__3213E83F0E8B46FA");

            entity.ToTable("regulatory_agency_master", "guest");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("address");
            entity.Property(e => e.Contact)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("contact");
            entity.Property(e => e.Department)
                .HasMaxLength(45)
                .IsUnicode(false)
                .HasColumnName("department");
            entity.Property(e => e.Link)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("link");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07729B4151");

            entity.ToTable("users", "guest");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserRole)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
