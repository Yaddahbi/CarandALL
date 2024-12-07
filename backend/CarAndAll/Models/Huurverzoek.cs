public class Huurverzoek
{
    public int HuurverzoekID { get; set; }
    public DateTime Startdatum { get; set; }
    public DateTime Einddatum { get; set; }
    public int HuurderID { get; set; }
    public int VoertuigID { get; set; }
    public string HuurStatus { get; set; } 
    public string Afwijzingsreden { get; set; } 
}
