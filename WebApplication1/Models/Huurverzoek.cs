namespace WebApplication1.Models
{
    public class Huurverzoek
    {
        public int HuurverzoekId { get; set; }
        public int HuurderId { get; set; }
        public Huurder Huurder { get; set; }
        public int VoertuigId { get; set; }
        public Voertuig Voertuig { get; set; }
        public DateTime StartDatum { get; set; }
        public DateTime EindDatum { get; set; }
        public string Status { get; set; } // "In afwachting", "Goedgekeurd", "Afgewezen"
    }
}

