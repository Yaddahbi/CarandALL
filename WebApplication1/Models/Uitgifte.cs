using System;

namespace WebApplication1.Models;

public class Uitgifte
{
    public int UitgifteID { get; set; }
    public int VoertuigID { get; set; }
    public string HuurderID { get; set; }
    public DateTime DatumUitgifte { get; set; }
    public string Opmerkingen { get; set; }
    public string Status { get; set; } = "Uitgegeven"; 
    
    public Voertuig Voertuig { get; set; }
    public User User { get; set; }

    public Uitgifte() { }
}
    