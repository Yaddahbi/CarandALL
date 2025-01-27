using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Dto_s
{
    public class SchadeCreateDto
    {
        [Required(ErrorMessage = "Het veld Kenteken is verplicht.")]
        public string Kenteken { get; set; } // Dit moet direct beschikbaar zijn

        [Required(ErrorMessage = "Beschrijving is verplicht.")]
        public string Beschrijving { get; set; }

        [Required(ErrorMessage = "Datum is verplicht.")]
        public DateTime Datum { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Kosten moeten een positief getal zijn.")]
        public double Kosten { get; set; }

        public string Status { get; set; } = "Open";
        public string Opmerkingen { get; set; } = "";
    }



}
