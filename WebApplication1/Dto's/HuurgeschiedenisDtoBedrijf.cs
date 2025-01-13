namespace WebApplication1.Dto_s
{
    public class HuurgeschiedenisDtoBedrijf
    {
        public int HuurverzoekId { get; set; }
        public DateTime StartDatum { get; set; }
        public DateTime EindDatum { get; set; }
        public string VoertuigMerk { get; set; }
        public string VoertuigType { get; set; }
        public decimal Kosten { get; set; }
        public string FactuurUrl { get; set; }
        public string Status { get; set; }
        public string MedewerkerNaam { get; set; }
    }
}
