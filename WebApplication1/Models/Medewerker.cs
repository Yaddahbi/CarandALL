namespace WebApplication1.Models
{
    public class Medewerker
    {
        public int MedewerkerId { get; set; }
        public string Naam { get; set; }
        public string Rol { get; set; } // "Backoffice", "Frontoffice"
        public string Email { get; set; }
        public string Wachtwoord { get; set; } // Nog versleutelen
    }

}
