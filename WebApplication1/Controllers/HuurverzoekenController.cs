using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Dto_s;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Huurverzoek>>> GetAllHuurverzoeken()
        {
            var huurverzoeken = await _context.Huurverzoeken
                .Include(h => h.User)
                .Include(h => h.Voertuig)
                .Select(h => new {
                    h.HuurverzoekId,
                    h.StartDatum,
                    h.EindDatum,
                    h.Status
                })
                .ToListAsync();
            return Ok(huurverzoeken);
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



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHuurverzoek(int id, [FromBody] HuurverzoekUpdateDto updateDto)
        {
            var huurverzoek = await _context.Huurverzoeken.FindAsync(id);
            if (huurverzoek == null)
            {
                return NotFound("Huurverzoek niet gevonden.");
            }
            huurverzoek.Status = updateDto.Status;
            if (updateDto.Status == "Afgewezen" && !string.IsNullOrEmpty(updateDto.Reden))
            {
                huurverzoek.Afwijzingsreden = updateDto.Reden;
            }
            _context.Huurverzoeken.Update(huurverzoek);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorize]
        [HttpGet("geschiedenis")]
        public async Task<ActionResult<IEnumerable<HuurGeschiedenisDto>>> GetHuurGeschiedenis([FromQuery] DateTime? startDatum, [FromQuery] DateTime? eindDatum, [FromQuery] string voertuigType)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Gebruiker is niet geauthenticeerd." });
            }
            var query = _context.Huurverzoeken
                .Include(h => h.Voertuig)
                .Where(h => h.UserId.Equals(userId));

            if (startDatum.HasValue)
                query = query.Where(h => h.StartDatum >= startDatum);

            if (eindDatum.HasValue)
                query = query.Where(h => h.EindDatum <= eindDatum);

            if (!string.IsNullOrEmpty(voertuigType))
                query = query.Where(h => h.Voertuig.Soort.Contains(voertuigType));

            var huurGeschiedenis = await query
                .Select(h => new HuurGeschiedenisDto
                {
                    HuurverzoekId = h.HuurverzoekId,
                    StartDatum = h.StartDatum,
                    EindDatum = h.EindDatum,
                    VoertuigMerk = h.Voertuig.Merk,
                    VoertuigType = h.Voertuig.Type,
                    Kosten = h.Voertuig.Prijs * ((h.EindDatum - h.StartDatum).Days + 1),
                    Status = h.Status,
                    FactuurUrl = $"/facturen/{h.HuurverzoekId}.pdf"
                })
                .ToListAsync();

            // Groepeer de verzoeken op basis van de status
            var verzoekenGroupedByStatus = huurGeschiedenis
                .GroupBy(h => h.Status)
                .ToDictionary(g => g.Key, g => g.ToList());

            return Ok(verzoekenGroupedByStatus);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostHuurverzoek(HuurverzoekDTO huurverzoekDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Gebruiker is niet geauthenticeerd." });
            }

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
                UserId = userId,
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

    public class HuurverzoekUpdateDto
    {
        public string Status { get; set; }
        public string Reden  { get; set; }
    }

}