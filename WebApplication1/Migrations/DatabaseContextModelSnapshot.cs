﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApplication1;

#nullable disable

namespace WebApplication1.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("WebApplication1.Models.Abonnement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("AangemaaktOp")
                        .HasColumnType("datetime2");

                    b.Property<string>("AbonnementType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("BedrijfsDomein")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("MaxMedewerkers")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Abonnementen");
                });

            modelBuilder.Entity("WebApplication1.Models.Huurverzoek", b =>
                {
                    b.Property<int>("HuurverzoekId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("HuurverzoekId"));

                    b.Property<string>("Afwijzingsreden")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("EindDatum")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("StartDatum")
                        .HasColumnType("datetime2");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("VoertuigId")
                        .HasColumnType("int");

                    b.HasKey("HuurverzoekId");

                    b.HasIndex("UserId");

                    b.HasIndex("VoertuigId");

                    b.ToTable("Huurverzoeken");
                });

            modelBuilder.Entity("WebApplication1.Models.Inname", b =>
                {
                    b.Property<int>("InnameID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("InnameID"));

                    b.Property<DateTime>("DatumInname")
                        .HasColumnType("datetime2");

                    b.Property<bool>("HeeftSchade")
                        .HasColumnType("bit");

                    b.Property<string>("HuurderID")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("SchadeOpmerkingen")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VoertuigID")
                        .HasColumnType("int");

                    b.HasKey("InnameID");

                    b.HasIndex("HuurderID");

                    b.HasIndex("VoertuigID");

                    b.ToTable("Innames");
                });

            modelBuilder.Entity("WebApplication1.Models.Notificatie", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Bericht")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DatumTijd")
                        .HasColumnType("datetime2");

                    b.Property<string>("GebruikerId")
                        .IsRequired()
                        .HasMaxLength(450)
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("IsGelezen")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.ToTable("Notificaties");
                });

            modelBuilder.Entity("WebApplication1.Models.Schade", b =>
                {
                    b.Property<int>("SchadeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SchadeId"));

                    b.Property<string>("Beschrijving")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.PrimitiveCollection<string>("FotoUrls")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Kosten")
                        .HasColumnType("float");

                    b.Property<string>("Opmerkingen")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VoertuigId")
                        .HasColumnType("int");

                    b.HasKey("SchadeId");

                    b.HasIndex("VoertuigId");

                    b.ToTable("Schades");
                });

            modelBuilder.Entity("WebApplication1.Models.Schadeclaim", b =>
                {
                    b.Property<int>("SchadeclaimId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SchadeclaimId"));

                    b.Property<string>("Beschrijving")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ClaimDatum")
                        .HasColumnType("datetime2");

                    b.PrimitiveCollection<string>("FotoUrls")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ReparatieDetails")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("SchadeId")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("SchadeclaimId");

                    b.HasIndex("SchadeId");

                    b.ToTable("Schadeclaims");
                });

            modelBuilder.Entity("WebApplication1.Models.Uitgifte", b =>
                {
                    b.Property<int>("UitgifteID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UitgifteID"));

                    b.Property<DateTime>("DatumUitgifte")
                        .HasColumnType("datetime2");

                    b.Property<string>("HuurderID")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Opmerkingen")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VoertuigID")
                        .HasColumnType("int");

                    b.HasKey("UitgifteID");

                    b.HasIndex("HuurderID");

                    b.HasIndex("VoertuigID");

                    b.ToTable("Uitgiftes");
                });

            modelBuilder.Entity("WebApplication1.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("Adres")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("BedrijfsAbonnementId")
                        .HasColumnType("int");

                    b.Property<string>("BedrijfsNaam")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("KvkNummer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Naam")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("Rol")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("BedrijfsAbonnementId");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("WebApplication1.Models.Voertuig", b =>
                {
                    b.Property<int>("VoertuigId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VoertuigId"));

                    b.Property<int>("Aanschafjaar")
                        .HasColumnType("int");

                    b.Property<string>("Kenteken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Kleur")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Merk")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Opmerkingen")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<decimal>("Prijs")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<string>("Soort")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("VoertuigId");

                    b.ToTable("Voertuigen");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("WebApplication1.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("WebApplication1.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("WebApplication1.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("WebApplication1.Models.Huurverzoek", b =>
                {
                    b.HasOne("WebApplication1.Models.User", "User")
                        .WithMany("Huurverzoeken")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Models.Voertuig", "Voertuig")
                        .WithMany("Huurverzoeken")
                        .HasForeignKey("VoertuigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("Voertuig");
                });

            modelBuilder.Entity("WebApplication1.Models.Inname", b =>
                {
                    b.HasOne("WebApplication1.Models.User", "User")
                        .WithMany("Innames")
                        .HasForeignKey("HuurderID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Models.Voertuig", "Voertuig")
                        .WithMany("Innames")
                        .HasForeignKey("VoertuigID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("Voertuig");
                });

            modelBuilder.Entity("WebApplication1.Models.Schade", b =>
                {
                    b.HasOne("WebApplication1.Models.Voertuig", "Voertuig")
                        .WithMany("Schades")
                        .HasForeignKey("VoertuigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Voertuig");
                });

            modelBuilder.Entity("WebApplication1.Models.Schadeclaim", b =>
                {
                    b.HasOne("WebApplication1.Models.Schade", "Schade")
                        .WithMany()
                        .HasForeignKey("SchadeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Schade");
                });

            modelBuilder.Entity("WebApplication1.Models.Uitgifte", b =>
                {
                    b.HasOne("WebApplication1.Models.User", "User")
                        .WithMany("Uitgiftes")
                        .HasForeignKey("HuurderID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Models.Voertuig", "Voertuig")
                        .WithMany("Uitgiftes")
                        .HasForeignKey("VoertuigID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("Voertuig");
                });

            modelBuilder.Entity("WebApplication1.Models.User", b =>
                {
                    b.HasOne("WebApplication1.Models.Abonnement", "BedrijfsAbonnement")
                        .WithMany("Medewerkers")
                        .HasForeignKey("BedrijfsAbonnementId");

                    b.Navigation("BedrijfsAbonnement");
                });

            modelBuilder.Entity("WebApplication1.Models.Abonnement", b =>
                {
                    b.Navigation("Medewerkers");
                });

            modelBuilder.Entity("WebApplication1.Models.User", b =>
                {
                    b.Navigation("Huurverzoeken");

                    b.Navigation("Innames");

                    b.Navigation("Uitgiftes");
                });

            modelBuilder.Entity("WebApplication1.Models.Voertuig", b =>
                {
                    b.Navigation("Huurverzoeken");

                    b.Navigation("Innames");

                    b.Navigation("Schades");

                    b.Navigation("Uitgiftes");
                });
#pragma warning restore 612, 618
        }
    }
}
