using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Data.DbEntities
{
    public partial class permit_account_serviceContext : DbContext
    {
        public permit_account_serviceContext()
        {
        }

        public permit_account_serviceContext(DbContextOptions<permit_account_serviceContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CityMaster> CityMasters { get; set; } = null!;

        public virtual DbSet<ClientMaster> ClientMasters { get; set; } = null!;
        public virtual DbSet<PermitMaster> PermitMasters { get; set; } = null!;
        public virtual DbSet<PermitMasterDetail> PermitMasterDetails { get; set; } = null!;
        public virtual DbSet<PermitMatrix> PermitMatrices { get; set; } = null!;
        public virtual DbSet<RegulatoryAgencyMaster> RegulatoryAgencyMasters { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=Pass@123;database=permit_account_service;treattinyasboolean=false", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.41-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<ClientMaster>(entity =>
            {
                entity.ToTable("client_master");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .HasColumnName("name");
            });

             modelBuilder.Entity<CityMaster>(entity =>
            {
                entity.ToTable("city_master");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.City)
                    .HasMaxLength(45)
                    .HasColumnName("city");

                entity.Property(e => e.County)
                    .HasMaxLength(45)
                    .HasColumnName("county");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasColumnName("created_on")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.State)
                    .HasMaxLength(45)
                    .HasColumnName("state");
            });

            modelBuilder.Entity<PermitMaster>(entity =>
            {
                entity.ToTable("permit_master");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Category)
                    .HasMaxLength(45)
                    .HasColumnName("category");

                entity.Property(e => e.City)
                    .HasMaxLength(45)
                    .HasColumnName("city");

                entity.Property(e => e.County)
                    .HasMaxLength(45)
                    .HasColumnName("county");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasColumnName("created_on")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Level)
                    .HasMaxLength(45)
                    .HasColumnName("level");

                entity.Property(e => e.PermitName)
                    .HasMaxLength(100)
                    .HasColumnName("permit_name");

                entity.Property(e => e.RegulatoryAgencyId).HasColumnName("regulatory_agency_id");

                entity.Property(e => e.RegulatoryAgencyName)
                    .HasMaxLength(100)
                    .HasColumnName("regulatory_agency_name");

                entity.Property(e => e.State)
                    .HasMaxLength(45)
                    .HasColumnName("state");

                entity.Property(e => e.FromBulkUpload)
                      .HasColumnName("from_bulk_upload")
                      .HasColumnType("bit(1)")
                      .HasDefaultValue(false);

                entity.Property(e => e.TypeOfProject)
                    .HasMaxLength(45)
                    .HasColumnName("type_of_project");
            });

            modelBuilder.Entity<PermitMasterDetail>(entity =>
            {
                entity.ToTable("permit_details");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AdditionalBasic)
                    .HasMaxLength(200)
                    .HasColumnName("additional_basic");

                entity.Property(e => e.AgencyReviewTimeMax).HasColumnName("agency_review_time_max");

                entity.Property(e => e.AgencyReviewTimeMin).HasColumnName("agency_review_time_min");

                entity.Property(e => e.BasicFees)
                    .HasPrecision(8, 3)
                    .HasColumnName("basic_fees");

                entity.Property(e => e.Description)
                    .HasMaxLength(200)
                    .HasColumnName("description");

                entity.Property(e => e.PermitId).HasColumnName("permit_id");

                entity.Property(e => e.PrepTimeMax).HasColumnName("prep_time_max");

                entity.Property(e => e.PrepTimeMin).HasColumnName("prep_time_min");

                entity.Property(e => e.Threshold)
                    .HasMaxLength(200)
                    .HasColumnName("threshold");
            });

            modelBuilder.Entity<PermitMatrix>(entity =>
            {
                entity.ToTable("permit_matrix");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ClientName).HasColumnName("client_name");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasColumnName("created_on")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.MatrixName)
                    .HasMaxLength(100)
                    .HasColumnName("matrix_name");

                entity.Property(e => e.PermitList)
                    .HasMaxLength(200)
                    .HasColumnName("permit_list");

                entity.Property(e => e.TypeOfProject)
                    .HasMaxLength(100)
                    .HasColumnName("type_of_project");

                entity.Property(e => e.Status)
                    .HasColumnType("TINYINT");
            });

            modelBuilder.Entity<RegulatoryAgencyMaster>(entity =>
            {
                entity.ToTable("regulatory_agency_master");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Address)
                    .HasMaxLength(200)
                    .HasColumnName("address");

                entity.Property(e => e.Contact)
                    .HasMaxLength(45)
                    .HasColumnName("contact");

                entity.Property(e => e.Department)
                    .HasMaxLength(45)
                    .HasColumnName("department");

                entity.Property(e => e.ContactPerson)
                    .HasMaxLength(100)
                    .HasColumnName("contact_person");

                entity.Property(e => e.Link)
                    .HasMaxLength(100)
                    .HasColumnName("link");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CreatedBy).HasColumnName("created_by");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasColumnName("created_on")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.IsActive).HasColumnName("is_active");

                entity.Property(e => e.UserName)
                    .HasMaxLength(45)
                    .HasColumnName("user_name");

                entity.Property(e => e.UserRole)
                    .HasMaxLength(20)
                    .HasColumnName("user_role");
                
                entity.Property(e => e.LastLoginDate)
                    .HasColumnType("datetime")
                    .HasColumnName("last_login_date")
                    .HasDefaultValue(null);
            
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
