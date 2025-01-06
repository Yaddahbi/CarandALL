namespace WebApplication1.Models
{
    public class Medewerker
    {
        public int MedewerkerId { get; set; }
        public string Naam { get; set; }
        public string Rol { get; set; } 
        public string Email { get; set; }
        public string Wachtwoord { get; set; } 
        public virtual ICollection<Uitgifte> Uitgiftes { get; set; }
        public virtual ICollection<Inname> Innames { get; set; }
        public List<Schade> Schademeldingen { get; set; }
        public List<Schadeclaim> Schadeclaims { get; set; }
        
        public Medewerker()
        {
            Schademeldingen = new List<Schade>();
            Schadeclaims = new List<Schadeclaim>();
        }
    }

}
