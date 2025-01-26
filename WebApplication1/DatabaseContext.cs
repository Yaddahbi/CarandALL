using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class DatabaseContext : IdentityDbContext<User>
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
        public DbSet<Inname> Innames { get; set; }
        public DbSet<Uitgifte> Uitgiftes { get; set; }
        public DbSet<Gebruiker> Gebruikers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Notificatie> Notificaties { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<Bedrijf>()
            //  .HasOne(b => b.Abonnement)
            // .WithOne(a => a.Bedrijf)
            // .HasForeignKey<Abonnement>(a => a.BedrijfId);

            modelBuilder.Entity<Huurder>()
                .HasOne(h => h.Bedrijf)
                .WithMany(b => b.Werknemers)
                .HasForeignKey(h => h.BedrijfId);

            modelBuilder.Entity<Huurverzoek>()
                .HasOne(hv => hv.Voertuig)
                .WithMany(v => v.Huurverzoeken)
                .HasForeignKey(hv => hv.VoertuigId);

            modelBuilder.Entity<Huurverzoek>()
                .HasOne(hv => hv.Huurder)
                .WithMany(h => h.Huurverzoeken)
                .HasForeignKey(hv => hv.HuurderId);

            modelBuilder.Entity<Schade>()
                .HasOne(s => s.Voertuig)
                .WithMany(v => v.Schades)
                .HasForeignKey(s => s.VoertuigId);

            modelBuilder.Entity<Uitgifte>()
                .HasOne(u => u.Voertuig)
                .WithMany(v => v.Uitgiftes)
                .HasForeignKey(u => u.VoertuigID);

            modelBuilder.Entity<Uitgifte>()
                .HasOne(u => u.Huurder)
                .WithMany(h => h.Uitgiftes)
                .HasForeignKey(u => u.HuurderID);

            modelBuilder.Entity<Inname>()
                .HasOne(i => i.Voertuig)
                .WithMany(v => v.Innames)
                .HasForeignKey(i => i.VoertuigID);

            modelBuilder.Entity<Inname>()
                .HasOne(i => i.Huurder)
                .WithMany(h => h.Innames)
                .HasForeignKey(i => i.HuurderID);
        }
        public List<Voertuig> GetAllVoertuigen()
        {
            return Voertuigen.ToList();
        }

        public Voertuig GetVoertuigById(int id) => Voertuigen.FirstOrDefault(v => v.VoertuigId == id);

        public List<Schade> GetAllSchades() 
        {
            return Schades
                .Include(s => s.Voertuig) 
                .ToList();
        }

        public Schade GetSchadeById(int id) => Schades.FirstOrDefault(s => s.SchadeId == id);

        public void CreateSchade(Schade schade)
        {
            Schades.Add(schade);
            SaveChanges();
        }

        public void UpdateSchade(Schade schade)
        {
            Schades.Update(schade);
            SaveChanges();
        }

        public void DeleteSchade(int id)
        {
            var schade = GetSchadeById(id);
            if (schade != null)
            {
                Schades.Remove(schade);
                SaveChanges();
            }
        }
        public List<Inname> ListInnames()
        {
            return Innames.Include(i => i.Voertuig).Include(i => i.Huurder).ToList();
        }
       
        public List<Uitgifte> GetAllUitgiftes()
        {
            return Uitgiftes.Include(u => u.Voertuig).Include(u => u.Huurder).ToList();
        }
        
    }
}

