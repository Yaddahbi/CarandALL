using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Voertuig
    {
        public int VoertuigId { get; set; }

        [Required]
        public string Merk { get; set; }

        [Required]
        public string Type { get; set; }

        [RegularExpression(@"^[A-Z]{2}-\d{3}-[A-Z]{2}$", ErrorMessage = "Ongeldig kenteken")]
        public string Kenteken { get; set; }

        [Required]
        public string Kleur { get; set; }

        [Range(1900, int.MaxValue, ErrorMessage = "Ongeldig aanschafjaar")]
        public int Aanschafjaar { get; set; }

        [Required]
        [EnumDataType(typeof(StatusType))]
        public string Status { get; set; } // "Beschikbaar", "In Reparatie", "Verhuurd"
        public List<Huurverzoek> Huurverzoeken { get; set; } = new List<Huurverzoek>(); 
    }
    public enum StatusType
    {
        Beschikbaar,
        InReparatie,
        Verhuurd
    }

}
