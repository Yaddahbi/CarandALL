﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using WebApplication1.Dto_s;
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

        // GET: api/Huurverzoeken
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HuurverzoekDto2>>> GetHuurverzoeken()
        {
            var huurverzoeken = await _context.Huurverzoeken
                .Include(h => h.Huurder)
                .Include(h => h.Voertuig)
                .Select(h => new HuurverzoekDto2
                {
                    HuurderId = h.HuurderId,
                    VoertuigId = h.VoertuigId,
                    StartDatum = h.StartDatum,
                    EindDatum = h.EindDatum,
                    HuurverzoekId = h.HuurverzoekId,
                    HuurderNaam = h.Huurder.Naam,
                    VoertuigMerk = h.Voertuig.Merk,
                    VoertuigType = h.Voertuig.Type,
                    Status = h.Status
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
                return NotFound();
            }

            return huurverzoek;
        }
        [HttpGet("geschiedenis/{huurderId}")]
        public async Task<ActionResult<IEnumerable<HuurGeschiedenisDto>>> GetHuurGeschiedenis(int huurderId, [FromQuery] DateTime? startDatum, [FromQuery] DateTime? eindDatum, [FromQuery] string voertuigType)
        {
            var query = _context.Huurverzoeken
                .Include(h => h.Voertuig)
                .Where(h => h.HuurderId == huurderId);

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHuurverzoek(int id, [FromBody] UpdateHuurverzoekDto dto)
        {
            var huurverzoek = await _context.Huurverzoeken
                .FirstOrDefaultAsync(h => h.HuurverzoekId == id);

            if (huurverzoek == null)
            {
                return NotFound("Huurverzoek niet gevonden.");
            }

            huurverzoek.Status = dto.HuurStatus;

            if (dto.HuurStatus == "Afgewezen" && !string.IsNullOrEmpty(dto.Afwijzingsreden))
            {
                huurverzoek.Afwijzingsreden = dto.Afwijzingsreden;
            }

            await _context.SaveChangesAsync();
            return Ok(huurverzoek);
        }

    }
}
