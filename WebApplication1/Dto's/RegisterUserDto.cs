namespace WebApplication1.Dto_s
{
    using System.ComponentModel.DataAnnotations;

    public class RegisterUserDto
    {
        [Required]
        public string Naam { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Wachtwoord { get; set; }

        public string Adres { get; set; }
        public bool IsZakelijk { get; set; }
        public string BedrijfsNaam { get; set; }
        public string KvkNummer { get; set; }
    }

}
