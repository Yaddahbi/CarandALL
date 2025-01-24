using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class Abonnement
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string BedrijfsDomein { get; set; }

        [Required]
        [MaxLength(50)]
        public string AbonnementType { get; set; }

        [Required]
        [Range(1, 1000)]
        public int MaxMedewerkers { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal KostenPerMaand { get; set; }

        public DateTime AangemaaktOp { get; set; } = DateTime.UtcNow;

        public DateTime? LaatstGewijzigdOp { get; set; }

        [JsonIgnore]
        public List<User> Medewerkers { get; set; } = new List<User>();

        public string? ToekomstigAbonnementType { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? ToekomstigeKosten { get; set; }

        public DateTime? WijzigingIngangsdatum { get; set; }
    }
}
