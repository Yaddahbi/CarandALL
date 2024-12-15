using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HuurverzoekenController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public HuurverzoekenController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Huurverzoek>> GetHuurverzoek(int id)
        {
            var huurverzoek = await _context.Huurverzoeken.FindAsync(id);

            if (huurverzoek == null)
            {
                return NotFound("Huurverzoek niet gevonden.");
            }

            return huurverzoek;
        }


        [HttpPost]
        public async Task<IActionResult> PostHuurverzoek(HuurverzoekDTO huurverzoekDto)
        {
            var voertuig = await _context.Voertuigen.FindAsync(huurverzoekDto.VoertuigId);
            if (voertuig == null)
            {
                return BadRequest("Voertuig bestaat niet.");
            }

            var isBezet = _context.Huurverzoeken.Any(h =>
                h.VoertuigId == huurverzoekDto.VoertuigId &&
                h.StartDatum <= huurverzoekDto.EindDatum &&
                h.EindDatum >= huurverzoekDto.StartDatum
            );
            if (isBezet)
            {
                return BadRequest("Voertuig is niet beschikbaar in deze periode.");
            }

            var huurverzoek = new Huurverzoek
            {
                HuurderId = huurverzoekDto.HuurderId,
                VoertuigId = huurverzoekDto.VoertuigId,
                StartDatum = huurverzoekDto.StartDatum,
                EindDatum = huurverzoekDto.EindDatum,
                Status = "In afwachting"
            };

            _context.Huurverzoeken.Add(huurverzoek);
            await _context.SaveChangesAsync();

            return Ok(huurverzoek);
        }

    }
}
