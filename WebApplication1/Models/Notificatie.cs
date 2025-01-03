
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{ 
    public class Notificatie
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        [MaxLength(450)] 
        public string GebruikerId { get; set; }

        [Required] 
        public string Bericht { get; set; }

        [Required] 
        public DateTime DatumTijd { get; set; } = DateTime.UtcNow;

        [Required] 
        public bool IsGelezen { get; set; } = false;
    }

}
