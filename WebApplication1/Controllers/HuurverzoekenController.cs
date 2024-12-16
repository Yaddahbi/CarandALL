﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;

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
                .Include(h => h.Huurder)
                .Include(h => h.Voertuig)
                .ToListAsync();

            if (huurverzoeken == null || huurverzoeken.Count == 0)
            {
                return NotFound("Geen huurverzoeken gevonden.");
            }

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
            if (updateDto.Status == "Afgewezen" && !string.IsNullOrEmpty(updateDto.Reason))
            {
                huurverzoek.Reason = updateDto.Reason;
            }
            _context.Huurverzoeken.Update(huurverzoek);
            await _context.SaveChangesAsync();

            return NoContent();
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

    public class HuurverzoekUpdateDto
    {
        public string Status { get; set; }
        public string Reden  { get; set; }
    }

}
