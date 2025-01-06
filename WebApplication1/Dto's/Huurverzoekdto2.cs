namespace WebApplication1.Models
{
    public class HuurverzoekDto2
    {
        public int HuurverzoekId { get; set; }
        public int HuurderId { get; set; }
        public string HuurderNaam { get; set; } // Nieuwe eigenschap
        public int VoertuigId { get; set; }
        public string VoertuigMerk { get; set; }
        public string VoertuigType { get; set; } // Nieuwe eigenschap
        public DateTime StartDatum { get; set; }
        public DateTime EindDatum { get; set; }
        public string Status { get; set; }
    }

}
