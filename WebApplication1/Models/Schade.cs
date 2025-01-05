using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Schade
    {
        [Key]
        public int SchadeId { get; set; }

        [Required(ErrorMessage = "VoertuigId is verplicht")]
        public int VoertuigId { get; set; }

        [Required(ErrorMessage = "Beschrijving is verplicht")]
        [StringLength(500, ErrorMessage = "Beschrijving mag niet langer zijn dan 500 tekens.")]
        public string Beschrijving { get; set; }

        [Required(ErrorMessage = "Kosten zijn verplicht")]
        [Range(0, double.MaxValue, ErrorMessage = "Kosten moeten een positief bedrag zijn.")]
        public double Kosten { get; set; }

        [Required(ErrorMessage = "Status is verplicht")]
        [StringLength(20, ErrorMessage = "Status mag niet langer zijn dan 20 tekens.")]
        public string Status { get; set; }

        // Voeg de datum automatisch toe bij het maken van de schade
        public DateTime Datum { get; set; } = DateTime.Now;
    }
}
