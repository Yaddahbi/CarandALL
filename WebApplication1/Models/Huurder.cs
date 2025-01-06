using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace WebApplication1.Models
{
    public class Huurder
    {
        public int HuurderId { get; set; }
        public string Naam { get; set; }
        public string Adres { get; set; }
        public string Email { get; set; }
        public string Telefoonnummer { get; set; }
        public bool IsZakelijk { get; set; } // True = Zakelijke werknemer, False = Particulier
        public int? BedrijfId { get; set; } // Voor zakelijke huurders
        public Bedrijf? Bedrijf { get; set; }
        public ICollection<Huurverzoek> Huurverzoeken { get; set; }
        public ICollection<Inname> Innames { get; set; }
        public ICollection<Uitgifte> Uitgiftes { get; set; }
        
        public Huurder()
        {
            Huurverzoeken = new List<Huurverzoek>();
            Uitgiftes = new List<Uitgifte>();
            Innames = new List<Inname>();
        }

    }
}
