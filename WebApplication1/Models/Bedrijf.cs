﻿namespace WebApplication1.Models
{
    public class Bedrijf
    {
        public int BedrijfId { get; set; }
        public string Naam { get; set; }
        public string Adres { get; set; }
        public string KvkNummer { get; set; }
        public Abonnement Abonnement { get; set; } // Navigatie naar het actieve abonnement
        public ICollection<Huurder> Werknemers { get; set; } = new List<Huurder>();
    }


}
