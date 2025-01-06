using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Gebruiker
    {
        public int Id { get; set; }

        [Required]
        public string Naam { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Wachtwoord { get; set; }

        public string Telefoonnummer { get; set; }
        
        // Rol: "Particulier" of "Zakelijk"
        [Required]
        public string Rol { get; set; }

        // Alleen voor zakelijke klanten
        public string BedrijfsNaam { get; set; }
        public string KvkNummer { get; set; }

        // Adres voor particulier en zakelijk
        public string Adres { get; set; }
    }
}
