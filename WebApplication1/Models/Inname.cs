using System;

namespace WebApplication1.Models;

public class Inname
{
    public int InnameID { get; set; }
    public int VoertuigID { get; set; }
    public int HuurderID { get; set; }
    public DateTime DatumInname { get; set; }
    public string SchadeOpmerkingen { get; set; }
    public bool Schade { get; set; } // true of false
    public string Status { get; set; } // "Teruggebracht", "Teruggebracht met schade"
    
    
    public Voertuig Voertuig { get; set; }
    public Huurder Huurder { get; set; }

    public Inname() { }
}
