namespace WebApplication1.Models;

public class Inname
{
    public int InnameID { get; set; }
    public int VoertuigID { get; set; }
    public int HuurderID { get; set; }
    public string HuurderNaam { get; set; }
    public string HuurderEmail { get; set; }
    public string HuuderTelefoonnummer { get; set; }
    public DateTime DatumInname { get; set; }
    public string SchadeOpmerkingen { get; set; }
    public string EindKilometerstand { get; set; }
    public bool HeeftSchade { get; set; }
    public string Status { get; set; }
    public Voertuig Voertuig { get; set; }
    public Huurder Huurder { get; set; }
    public List<Schade> Schades { get; set; } = new List<Schade>();

    public Inname()
    {
        DatumInname = DateTime.Now;
        HeeftSchade = false;
        Status = "Teruggebracht";
    }

    public void UpdateStatus()
    {
        if (HeeftSchade)
        {
            Status = "In Reparatie";
        }
        else
        {
            Status = "Beschikbaar";
        }
    }

    public void VoegSchadeToe(Schade nieuweSchade)
    {
        if (nieuweSchade != null)
        {
            Schades.Add(nieuweSchade);
            HeeftSchade = true;
            SchadeOpmerkingen = nieuweSchade.Beschrijving;
            UpdateStatus();
        }
    }

    public string Samenvatting()
    {
        return
            $"InnameID: {InnameID}, VoertuigID: {VoertuigID}, HuurderNaam: {HuurderNaam}, Status: {Status}, Datum: {DatumInname.ToShortDateString()}, HeeftSchade: {HeeftSchade}";
    }
}
