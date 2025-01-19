using WebApplication1.Dto_s;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class HuurverzoekService
    {
        private readonly DatabaseContext _context;

        public HuurverzoekService(DatabaseContext context)
        {
            _context = context;
        }

        public Huurverzoek UpdateHuurverzoekStatus(int id, UpdateHuurverzoekDto dto)
        {
            var huurverzoek = _context.Huurverzoeken.Find(id);
            if (huurverzoek == null)
                throw new Exception("Huurverzoek not found.");

            if (dto.HuurStatus == "Afgewezen" && string.IsNullOrEmpty(dto.Afwijzingsreden))
                throw new Exception("Afwijzingsreden is required for rejection.");

            huurverzoek.Status = dto.HuurStatus;
            huurverzoek.Afwijzingsreden = dto.HuurStatus == "Afgewezen" ? dto.Afwijzingsreden : null;

            _context.SaveChanges();
            return huurverzoek;
        }
    }
}
