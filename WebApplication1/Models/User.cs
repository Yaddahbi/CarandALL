using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class User : IdentityUser
    {
        public string Naam { get; set; }
        public string Adres { get; set; }
        public string Rol { get; set; }
        public string? BedrijfsNaam { get; set; }
        public string? KvkNummer { get; set; }

        [JsonIgnore]
        public List<Huurverzoek> Huurverzoeken { get; set; } = new List<Huurverzoek>();
        [JsonIgnore]
        public ICollection<Inname> Innames { get; set; } = new List<Inname>();
        [JsonIgnore]
        public ICollection<Uitgifte> Uitgiftes { get; set; } = new List<Uitgifte>();
 

        // Relatie met Abonnement
        public int? BedrijfsAbonnementId { get; set; }
        [ForeignKey("BedrijfsAbonnementId")]
        public Abonnement? BedrijfsAbonnement { get; set; }

    }
}
