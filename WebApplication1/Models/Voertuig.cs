namespace WebApplication1.Models
{
    public class Voertuig
    {
        public int VoertuigId { get; set; }
        public string Merk { get; set; }
        public string Type { get; set; }
        public string Kenteken { get; set; }
        public string Kleur { get; set; }
        public int Aanschafjaar { get; set; }
        public string Status { get; set; } // "Beschikbaar", "In Reparatie", "Verhuurd"
        public List<Huurverzoek> Huurverzoeken { get; set; } = new List<Huurverzoek>(); 
    }


}
