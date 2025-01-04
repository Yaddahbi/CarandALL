using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class Abonnement
    {
        public int Id { get; set; }
        public string BedrijfsDomein { get; set; } 
        public string AbonnementType { get; set; }
        public int MaxMedewerkers { get; set; }

        public DateTime AangemaaktOp { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public List<User> Medewerkers { get; set; } = new List<User>();
    }


}
