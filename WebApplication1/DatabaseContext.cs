using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }
        public DbSet<Huurder> Huurders { get; set; }
        public DbSet<Bedrijf> Bedrijven { get; set; }
        public DbSet<Voertuig> Voertuigen { get; set; }
        public DbSet<Abonnement> Abonnementen { get; set; }
        public DbSet<Huurverzoek> Huurverzoeken { get; set; }
        public DbSet<Schade> Schades { get; set; }
        public DbSet<Medewerker> Medewerkers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Bedrijf>()
                .HasOne(b => b.Abonnement)
                .WithOne(a => a.Bedrijf)
                .HasForeignKey<Abonnement>(a => a.BedrijfId);

            modelBuilder.Entity<Huurder>()
                .HasOne(h => h.Bedrijf)
                .WithMany(b => b.Werknemers)
                .HasForeignKey(h => h.BedrijfId);

            modelBuilder.Entity<Huurverzoek>()
                .HasOne(hv => hv.Huurder)
                .WithMany(h => h.Huurverzoeken)
                .HasForeignKey(hv => hv.HuurderId);

            modelBuilder.Entity<Huurverzoek>()
                .HasOne(hv => hv.Voertuig)
                .WithMany(v => v.Huurverzoeken)
                .HasForeignKey(hv => hv.VoertuigId);
        }
    }
}

