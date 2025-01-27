using System;

namespace WebApplication1.Models
{
    public class DeletedUser
    {
        public string Id { get; set; }
        public string Naam { get; set; }
        public string Email { get; set; }
        public string Adres { get; set; }
        public string Rol { get; set; }
        public string? BedrijfsNaam { get; set; }
        public string? KvkNummer { get; set; }
        public int? BedrijfsAbonnementId { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}