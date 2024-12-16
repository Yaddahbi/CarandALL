using System;

namespace WebApplication1.Models;

public class Uitgifte
{
    public int UitgifteID { get; set; }
    public int VoertuigID { get; set; }
    public int HuurderID { get; set; }
    public DateTime DatumUitgifte { get; set; }
    public string Opmerkingen { get; set; }
    public string Status { get; set; } // "Uitgegeven"
    
    public Voertuig Voertuig { get; set; }
    public Huurder Huurder { get; set; }

    public Uitgifte() { }
}
    