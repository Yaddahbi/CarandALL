using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;

namespace WebApplication1.Models
{
    public class Abonnement
    {
        public int AbonnementId { get; set; }
        public string AbonnementType { get; set; } // "Pay-as-you-go", "Prepaid"

        [Column(TypeName = "decimal(18,2)")]
        public decimal Kosten { get; set; }
        public DateTime Startdatum { get; set; }
        public DateTime Einddatum { get; set; }
        public int BedrijfId { get; set; }
        public Bedrijf Bedrijf { get; set; } // Bedrijf dat het abonnement gebruikt
    }


}
