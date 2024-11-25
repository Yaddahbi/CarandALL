namespace WebApplication1.Models
{
    public class Schade
    {
        public int SchadeId { get; set; }
        public int VoertuigId { get; set; }
        public Voertuig Voertuig { get; set; } 
        public string Beschrijving { get; set; }
        public DateTime Datum { get; set; }
        public string Status { get; set; } // "In behandeling", "Afgehandeld"
    }

}
