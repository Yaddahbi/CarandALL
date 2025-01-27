﻿using Microsoft.AspNetCore.Http;
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
    //[Authorize(Roles = "Medewerker")]
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
        public async Task<IActionResult> UpdateHuurverzoekStatus(int id, [FromBody] HuurverzoekUpdateDto updateDto)
        {
            var huurverzoek = await _context.Huurverzoeken.Include(h => h.Voertuig).FirstOrDefaultAsync(h => h.HuurverzoekId == id);
            if (huurverzoek == null)
            {
                return NotFound("Huurverzoek niet gevonden.");
            }

            // Controleer of de afwijzingsreden aanwezig is bij afwijzing
            if (updateDto.Status == "Afgewezen" && string.IsNullOrWhiteSpace(updateDto.Reden))
            {
                return BadRequest("Afwijzingsreden is verplicht bij afwijzing.");
            }

            // Update de status en afwijzingsreden van het huurverzoek
            huurverzoek.Status = updateDto.Status;
            if (updateDto.Status == "Afgewezen" && !string.IsNullOrEmpty(updateDto.Reden))
            {
                huurverzoek.Afwijzingsreden = updateDto.Reden;
            }
            else
            {
                huurverzoek.Afwijzingsreden = null;
            }

            // Maak de notificatie voor de gebruiker
            string bericht = string.Empty;
            if (updateDto.Status == "Goedgekeurd")
            {
                bericht = $"Je huurverzoek voor het voertuig {huurverzoek.Voertuig.Merk} {huurverzoek.Voertuig.Type} is goedgekeurd van {huurverzoek.StartDatum.ToShortDateString()} tot {huurverzoek.EindDatum.ToShortDateString()}.";
            }
            else if (updateDto.Status == "Afgewezen")
            {
                bericht = $"Je huurverzoek voor het voertuig {huurverzoek.Voertuig.Merk} {huurverzoek.Voertuig.Type} is afgewezen. Afwijzingsreden: {huurverzoek.Afwijzingsreden}.";
            }

            // Maak een notificatie object en voeg deze toe aan de context
            var notificatie = new Notificatie
            {
                GebruikerId = huurverzoek.UserId,
                Bericht = bericht
            };

            _context.Notificaties.Add(notificatie);

            // Werk het huurverzoek bij in de database
            _context.Huurverzoeken.Update(huurverzoek);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [Authorize]  
        [HttpGet("bedrijf/huurgeschiedenis")]
        public async Task<ActionResult<IEnumerable<HuurgeschiedenisDtoBedrijf>>> GetHuurGeschiedenisVanMedewerkers(
     [FromQuery] DateTime? startDatum,
     [FromQuery] DateTime? eindDatum,
     [FromQuery] string voertuigType)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Gebruiker is niet geauthenticeerd." });
            }

            var abonnementId = User.FindFirst("AbonnementId")?.Value;
            if (string.IsNullOrEmpty(abonnementId))
            {
                return Unauthorized(new { error = "Abonnement niet gevonden." });
            }

            var query = _context.Huurverzoeken
                .Include(h => h.Voertuig)
                .Where(h => h.User.BedrijfsAbonnementId == int.Parse(abonnementId)); // Filter op abonnement

            if (startDatum.HasValue)
                query = query.Where(h => h.StartDatum >= startDatum);

            if (eindDatum.HasValue)
                query = query.Where(h => h.EindDatum <= eindDatum);

            if (!string.IsNullOrEmpty(voertuigType))
                query = query.Where(h => h.Voertuig.Soort.Contains(voertuigType));

            var huurGeschiedenis = await query
                .Select(h => new HuurgeschiedenisDtoBedrijf
                {
                    HuurverzoekId = h.HuurverzoekId,
                    StartDatum = h.StartDatum,
                    EindDatum = h.EindDatum,
                    VoertuigMerk = h.Voertuig.Merk,
                    VoertuigType = h.Voertuig.Type,
                    Kosten = h.Voertuig.Prijs * ((h.EindDatum - h.StartDatum).Days + 1),
                    Status = h.Status,
                    FactuurUrl = $"/facturen/{h.HuurverzoekId}.pdf",
                    MedewerkerNaam = h.User.Naam
                })
                .ToListAsync();

            return Ok(huurGeschiedenis.GroupBy(h => h.MedewerkerNaam)
                .ToDictionary(g => g.Key, g => g.ToList()));
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