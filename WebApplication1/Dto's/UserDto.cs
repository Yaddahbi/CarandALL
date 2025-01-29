namespace WebApplication1.Dto_s
{
    public class UserDto
    {
        public string Rol { get; set; } 
        public string Naam { get; set; }
        public string Email { get; set; }
        public string Wachtwoord { get; set; }
        public string Adres { get; set; }
        public string Telefoonnummer { get; set; }
        public string? BedrijfsNaam { get; set; }
        public string? KvkNummer { get; set; }
        public string? AbonnementType { get; set; }
        public string? ConfirmPassword { get; set; }
    }

}