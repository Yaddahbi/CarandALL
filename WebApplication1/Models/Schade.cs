namespace WebApplication1.Models
{
    public class Schade
    {
        public int SchadeId { get; set; }
        public int VoertuigId { get; set; }
        public Voertuig Voertuig { get; set; }
        public string Beschrijving { get; set; }
        public DateTime Datum { get; set; }
        public double Kosten { get; set; }
        public string Status { get; set; }
        public List<string> FotoUrls { get; set; } 
        public string Opmerkingen { get; set; }
        
        private static readonly string[] ToegestaneStatussen = { "Open", "In behandeling", "Afgehandeld", "In reparatie" };

        public Schade()
        {
            FotoUrls = new List<string>();
            Opmerkingen = string.Empty;
            Status = "Open";
        }

        public Schade(int voertuigId, string beschrijving, DateTime datum, double kosten, List<string> fotoUrls, string status = "Open")
        {
            if (string.IsNullOrWhiteSpace(beschrijving))
                throw new ArgumentException("Beschrijving mag niet leeg zijn.");

            if (kosten < 0)
                throw new ArgumentException("Kosten mogen niet negatief zijn.");

            if (datum > DateTime.Now)
                throw new ArgumentException("Datum mag niet in de toekomst liggen.");

            if (!ToegestaneStatussen.Contains(status))
                throw new ArgumentException($"Status moet een van de volgende zijn: {string.Join(", ", ToegestaneStatussen)}.");

            VoertuigId = voertuigId;
            Beschrijving = beschrijving;
            Datum = datum;
            Kosten = kosten;
            FotoUrls = fotoUrls ?? new List<string>();
            Status = status;
            Opmerkingen = string.Empty;
        }

        public void VoegOpmerkingToe(string opmerking)
        {
            if (string.IsNullOrWhiteSpace(opmerking))
                throw new ArgumentException("Opmerking mag niet leeg zijn.");
            Opmerkingen = opmerking;
        }

        public void UpdateSchade(string nieuweBeschrijving, double nieuweKosten, string nieuweStatus, List<string> nieuweFotoUrls = null)
        {
            if (string.IsNullOrWhiteSpace(nieuweBeschrijving))
                throw new ArgumentException("Beschrijving mag niet leeg zijn.");

            if (nieuweKosten < 0)
                throw new ArgumentException("Kosten mogen niet negatief zijn.");

            if (!ToegestaneStatussen.Contains(nieuweStatus))
                throw new ArgumentException($"Status moet een van de volgende zijn: {string.Join(", ", ToegestaneStatussen)}.");

            Beschrijving = nieuweBeschrijving;
            Kosten = nieuweKosten;
            Status = nieuweStatus;
            FotoUrls = nieuweFotoUrls ?? FotoUrls;
        }
    }
}