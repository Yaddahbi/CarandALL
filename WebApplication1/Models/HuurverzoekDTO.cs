namespace WebApplication1.Models
{
    public class HuurverzoekDTO
    {
        public int HuurderId { get; set; }
        public int VoertuigId { get; set; }
        public DateTime StartDatum { get; set; }
        public DateTime EindDatum { get; set; }
    }
}
