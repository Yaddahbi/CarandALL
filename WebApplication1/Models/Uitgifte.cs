namespace WebApplication1.Models;

public class Uitgifte
{
    public int UitgifteID { get; set; }
    public int VoertuigID { get; set; }
    public int HuurderID { get; set; }
    public string HuurderNaam { get; set; }
    public string HuurderEmail { get; set; }
    public string HuuderTelefoonnummer { get; set; }
    public DateTime DatumUitgifte { get; set; }
    public string BeginKilometerstand { get; set; }
    public string Opmerkingen { get; set; }
    public string Status { get; set; } = "Uitgegeven";

    public Voertuig Voertuig { get; set; }
    public Huurder Huurder { get; set; }
    public Huurverzoek Huurverzoek { get; set; }
    
    public Uitgifte()
    {
        DatumUitgifte = DateTime.Now;
    }

    public void UpdateStatus(string nieuweStatus)
    {
        if (!string.IsNullOrEmpty(nieuweStatus))
        {
            Status = nieuweStatus;
        }
    }

    public void VoegOpmerkingToe(string nieuweOpmerking)
    {
        if (!string.IsNullOrEmpty(nieuweOpmerking))
        {
            Opmerkingen += $"{DateTime.Now}: {nieuweOpmerking}\n";
        }
    }

    public string Samenvatting()
    {
        return
            $"UitgifteID: {UitgifteID}, VoertuigID: {VoertuigID}, HuurderNaam: {HuurderNaam}, Status: {Status}, Datum: {DatumUitgifte.ToShortDateString()}, BeginKilometerstand: {BeginKilometerstand}";
    }

    public void StelVoertuigIn(Voertuig voertuig)
    {
        if (voertuig != null)
        {
            Voertuig = voertuig;
            VoertuigID = voertuig.VoertuigId;
        }
    }

    public void StelHuurderIn(Huurder huurder)
    {
        if (huurder != null)
        {
            Huurder = huurder;
            HuurderID = huurder.HuurderId;
            HuurderNaam = huurder.Naam;
            HuurderEmail = huurder.Email;
            HuuderTelefoonnummer = huurder.Telefoonnummer;
        }
    }
}

    