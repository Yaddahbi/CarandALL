namespace WebApplication1.Models
{
    public class Huurverzoek
    {
        public int HuurverzoekId { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int VoertuigId { get; set; }
        public Voertuig Voertuig { get; set; }
        public DateTime StartDatum { get; set; }
        public DateTime EindDatum { get; set; }
        public string Status { get; set; } // "In afwachting", "Goedgekeurd", "Afgewezen"
        public string? Afwijzingsreden { get; set; }
        public string Opmerkingen { get; set; }
        
    }
}

