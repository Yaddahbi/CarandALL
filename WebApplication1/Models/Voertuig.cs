using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace WebApplication1.Models
{
    public class Voertuig
    {
        public int VoertuigId { get; set; }

        [Required]
        public string Soort { get; set; } 

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
        public string Status { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18, 2)")] 
        [Range(0, double.MaxValue, ErrorMessage = "Ongeldige prijs")]
        public decimal Prijs { get; set; }

        [JsonIgnore]
        public List<Huurverzoek> Huurverzoeken { get; set; } = new List<Huurverzoek>();
        [JsonIgnore]
        public List<Schade> Schades { get; set; } = new List<Schade>();
        [JsonIgnore]
        public List<Uitgifte> Uitgiftes { get; set; } = new List<Uitgifte>(); 
        [JsonIgnore]
        public List<Inname> Innames { get; set; } = new List<Inname>();  
        
        public Voertuig()
        {
            Uitgiftes = new List<Uitgifte>();
            Innames = new List<Inname>();
            Huurverzoeken = new List<Huurverzoek>();
            Schades = new List<Schade>();
        }
    }

    public enum StatusType
    {
        Beschikbaar,
        InReparatie,
        Verhuurd
    }
}
