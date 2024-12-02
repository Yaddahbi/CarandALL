﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApplication1;

#nullable disable

namespace WebApplication1.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20241124185148_UpdateVoertuigModel")]
    partial class UpdateVoertuigModel
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("WebApplication1.Models.Abonnement", b =>
                {
                    b.Property<int>("AbonnementId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AbonnementId"));

                    b.Property<string>("AbonnementType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("BedrijfId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Einddatum")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("Kosten")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("Startdatum")
                        .HasColumnType("datetime2");

                    b.HasKey("AbonnementId");

                    b.HasIndex("BedrijfId")
                        .IsUnique();

                    b.ToTable("Abonnementen");
                });

            modelBuilder.Entity("WebApplication1.Models.Bedrijf", b =>
                {
                    b.Property<int>("BedrijfId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BedrijfId"));

                    b.Property<string>("Adres")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("KvkNummer")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Naam")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("BedrijfId");

                    b.ToTable("Bedrijven");
                });

            modelBuilder.Entity("WebApplication1.Models.Huurder", b =>
                {
                    b.Property<int>("HuurderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("HuurderId"));

                    b.Property<string>("Adres")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("BedrijfId")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsZakelijk")
                        .HasColumnType("bit");

                    b.Property<string>("Naam")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Telefoonnummer")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("HuurderId");

                    b.HasIndex("BedrijfId");

                    b.ToTable("Huurders");
                });

            modelBuilder.Entity("WebApplication1.Models.Huurverzoek", b =>
                {
                    b.Property<int>("HuurverzoekId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("HuurverzoekId"));

                    b.Property<DateTime>("EindDatum")
                        .HasColumnType("datetime2");

                    b.Property<int>("HuurderId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDatum")
                        .HasColumnType("datetime2");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VoertuigId")
                        .HasColumnType("int");

                    b.HasKey("HuurverzoekId");

                    b.HasIndex("HuurderId");

                    b.HasIndex("VoertuigId");

                    b.ToTable("Huurverzoeken");
                });

            modelBuilder.Entity("WebApplication1.Models.Medewerker", b =>
                {
                    b.Property<int>("MedewerkerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("MedewerkerId"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Naam")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Rol")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Wachtwoord")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MedewerkerId");

                    b.ToTable("Medewerkers");
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

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("VoertuigId")
                        .HasColumnType("int");

                    b.HasKey("SchadeId");

                    b.HasIndex("VoertuigId");

                    b.ToTable("Schades");
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

            modelBuilder.Entity("WebApplication1.Models.Abonnement", b =>
                {
                    b.HasOne("WebApplication1.Models.Bedrijf", "Bedrijf")
                        .WithOne("Abonnement")
                        .HasForeignKey("WebApplication1.Models.Abonnement", "BedrijfId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bedrijf");
                });

            modelBuilder.Entity("WebApplication1.Models.Huurder", b =>
                {
                    b.HasOne("WebApplication1.Models.Bedrijf", "Bedrijf")
                        .WithMany("Werknemers")
                        .HasForeignKey("BedrijfId");

                    b.Navigation("Bedrijf");
                });

            modelBuilder.Entity("WebApplication1.Models.Huurverzoek", b =>
                {
                    b.HasOne("WebApplication1.Models.Huurder", "Huurder")
                        .WithMany("Huurverzoeken")
                        .HasForeignKey("HuurderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApplication1.Models.Voertuig", "Voertuig")
                        .WithMany("Huurverzoeken")
                        .HasForeignKey("VoertuigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Huurder");

                    b.Navigation("Voertuig");
                });

            modelBuilder.Entity("WebApplication1.Models.Schade", b =>
                {
                    b.HasOne("WebApplication1.Models.Voertuig", "Voertuig")
                        .WithMany()
                        .HasForeignKey("VoertuigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Voertuig");
                });

            modelBuilder.Entity("WebApplication1.Models.Bedrijf", b =>
                {
                    b.Navigation("Abonnement")
                        .IsRequired();

                    b.Navigation("Werknemers");
                });

            modelBuilder.Entity("WebApplication1.Models.Huurder", b =>
                {
                    b.Navigation("Huurverzoeken");
                });

            modelBuilder.Entity("WebApplication1.Models.Voertuig", b =>
                {
                    b.Navigation("Huurverzoeken");
                });
#pragma warning restore 612, 618
        }
    }
}
