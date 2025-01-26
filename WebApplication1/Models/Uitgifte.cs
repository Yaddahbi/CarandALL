namespace WebApplication1.Models;

public class Uitgifte
{
    public int UitgifteID { get; set; }
    public int VoertuigID { get; set; }
    public int UserID { get; set; }
    public string UserNaam { get; set; }
    public string UserEmail { get; set; }
    public string UserTelefoonnummer { get; set; }
    public DateTime DatumUitgifte { get; set; }
    public string BeginKilometerstand { get; set; }
    public string Opmerkingen { get; set; }
    public string Status { get; set; } = "Uitgegeven";

    public Voertuig Voertuig { get; set; }
    public  User User { get; set; }
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
            $"UitgifteID: {UitgifteID}, VoertuigID: {VoertuigID}, HuurderNaam: {UserNaam}, Status: {Status}, Datum: {DatumUitgifte.ToShortDateString()}, BeginKilometerstand: {BeginKilometerstand}";
    }

    public void StelVoertuigIn(Voertuig voertuig)
    {
        if (voertuig != null)
        {
            Voertuig = voertuig;
            VoertuigID = voertuig.VoertuigId;
        }
    }

    public void StelUserIn(User user)
    {
        if (user != null)
        {
            user = user;
            UserID = User.ID; 
            UserNaam = User.Naam;
            UserEmail = User.Email;
            UserTelefoonnummer = User.Telefoonnummer;
        }
    }
}

    