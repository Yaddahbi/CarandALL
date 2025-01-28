using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Dto_s
{
    public class VoertuigDto
    {
        [Required]
        public string Soort { get; set; }

        [Required]
        public string Merk { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        [RegularExpression(@"^[A-Z]{2}-\d{3}-[A-Z]{2}$", ErrorMessage = "Ongeldig kenteken")]
        public string Kenteken { get; set; }

        [Required]
        public string Kleur { get; set; }

        [Required]
        [Range(1900, int.MaxValue, ErrorMessage = "Ongeldig aanschafjaar")]
        public int Aanschafjaar { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Ongeldige prijs")]
        public decimal Prijs { get; set; }

        [StringLength(500, ErrorMessage = "Opmerkingen mogen maximaal 500 tekens bevatten")]
        public string? Opmerkingen { get; set; }
    }

}
