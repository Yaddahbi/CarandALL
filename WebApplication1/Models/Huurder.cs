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
        public List<Huurverzoek> Huurverzoeken { get; set; } = new List<Huurverzoek>();

    }
}
