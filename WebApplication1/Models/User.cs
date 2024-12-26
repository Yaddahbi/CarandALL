using Microsoft.AspNetCore.Identity;

namespace WebApplication1.Models
{
    public class User : IdentityUser
    {
        public string Naam { get; set; }
        public string Adres { get; set; }
        public string Rol { get; set; }
        public string? BedrijfsNaam { get; set; }
        public string? KvkNummer { get; set; }
        public List<Huurverzoek> Huurverzoeken { get; set; } = new List<Huurverzoek>();
    }
}
