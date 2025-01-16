using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsvHelper;
using System.Globalization;
using System.IO;
using System.Text;
using WebApplication1;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoertuigsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public VoertuigsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Voertuigs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Voertuig>>> GetVoertuigen()
        {
            return await _context.Voertuigen.ToListAsync();
        }

        // GET: api/Voertuigs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Voertuig>> GetVoertuig(int id)
        {
            var voertuig = await _context.Voertuigen.FindAsync(id);

            if (voertuig == null)
            {
                return NotFound();
            }

            return voertuig;
        }

        // GET: api/Voertuigs/filter
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Voertuig>>> GetFilteredVoertuigen(
            [FromQuery] string? soort = null,
            [FromQuery] DateTime? startDatum = null,
            [FromQuery] DateTime? eindDatum = null,
            [FromQuery] string? sorteerOp = null)
        {
            if (!startDatum.HasValue || !eindDatum.HasValue)
            {
                return BadRequest("Startdatum en einddatum zijn verplicht.");
            }

            var query = _context.Voertuigen.AsQueryable();

            if (!string.IsNullOrEmpty(soort))
                query = query.Where(v => v.Soort == soort);

            query = query.Where(v => !v.Huurverzoeken.Any(h =>
                h.StartDatum <= eindDatum && h.EindDatum >= startDatum));

            switch (sorteerOp)
            {
                case "prijs":
                    query = query.OrderBy(v => v.Prijs);
                    break;
                case "prijsHL":
                    query = query.OrderByDescending(v => v.Prijs);
                    break;
                case "merk":
                    query = query.OrderBy(v => v.Merk);
                    break;
                case "merkZA":
                    query = query.OrderBy(v => v.Merk);
                    break;
                case "beschikbaarheid":
                    query = query.OrderBy(v => v.Status);
                    break;
            }

            return await query.ToListAsync();
        }


        // PUT: api/Voertuigs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVoertuig(int id, Voertuig voertuig)
        {
            if (id != voertuig.VoertuigId)
            {
                return BadRequest();
            }

            _context.Entry(voertuig).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VoertuigExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Voertuigs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Voertuig>> PostVoertuig(Voertuig voertuig)
        {
            _context.Voertuigen.Add(voertuig);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVoertuig", new { id = voertuig.VoertuigId }, voertuig);
        }

        // DELETE: api/Voertuigs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoertuig(int id)
        {
            var voertuig = await _context.Voertuigen.FindAsync(id);
            if (voertuig == null)
            {
                return NotFound();
            }

            _context.Voertuigen.Remove(voertuig);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool VoertuigExists(int id)
        {
            return _context.Voertuigen.Any(e => e.VoertuigId == id);
        }

        [HttpGet("verhuurde")]
        public async Task<ActionResult<IEnumerable<object>>> GetVerhuurdeVoertuigen(
            [FromQuery] DateTime? startDatum = null,
            [FromQuery] DateTime? eindDatum = null,
            [FromQuery] string? voertuigType = null,
            [FromQuery] string? huurder = null)
        {
            var query = _context.Voertuigen
                .Where(v => v.Status == StatusType.Verhuurd.ToString())
                .Include(v => v.Huurverzoeken)
                .ThenInclude(h => h.Huurder)
                .AsQueryable();

            if (startDatum.HasValue && eindDatum.HasValue)
            {
                query = query.Where(v => v.Huurverzoeken.Any(h =>
                    h.StartDatum <= eindDatum && h.EindDatum >= startDatum));
            }

            if (!string.IsNullOrEmpty(voertuigType))
            {
                query = query.Where(v => v.Soort == voertuigType);
            }

            if (!string.IsNullOrEmpty(huurder))
            {
                query = query.Where(v => v.Huurverzoeken.Any(h => h.Huurder.Naam.Contains(huurder)));
            }

            var voertuigen = await query.ToListAsync();

            var result = voertuigen.Select(v => new
            {
                v.VoertuigId,
                v.Merk,
                v.Type,
                v.Kenteken,
                v.Status,
                Huurder = v.Huurverzoeken.FirstOrDefault()?.Huurder?.Naam,
                Verhuurdatum = v.Huurverzoeken.FirstOrDefault()?.StartDatum
            }).ToList();

            return Ok(result);
        }

        [HttpGet("status")]
        public async Task<ActionResult<IEnumerable<object>>> GetVoertuigStatus(
            [FromQuery] string? status = null)
        {
            var query = _context.Voertuigen.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(v => v.Status == status);
            }

            var result = await query.Select(v => new
            {
                v.VoertuigId,
                v.Merk,
                v.Type,
                v.Kenteken,
                v.Status
            }).ToListAsync();

            return Ok(result);
        }

        [HttpPut("{id}/blokkeer")]
        public async Task<IActionResult> BlokkeerVoertuig(int id, [FromBody] string reden)
        {
            var voertuig = await _context.Voertuigen.FindAsync(id);

            if (voertuig == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            voertuig.Status = StatusType.InReparatie.ToString();
            voertuig.Schades.Add(new Schade
            {
                Beschrijving = reden,
                Datum = DateTime.UtcNow,
                Voertuig = voertuig
            });

            _context.Entry(voertuig).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok($"Voertuig {id} is geblokkeerd met reden: {reden}");
        }

        [HttpGet("export-verhuurde-voertuigen")]
        public IActionResult ExportVerhuurdeVoertuigenToCsv(DateTime startDatum, DateTime eindDatum)
        {
            
            var verhuurdeVoertuigen = _context.Voertuigen
                .Where(v => v.Huurverzoeken.Any(h => h.StartDatum >= startDatum && h.EindDatum <= eindDatum))
                .Include(v => v.Huurverzoeken)
                .ThenInclude(h => h.Huurder)
                .ToList();
            
            var csv = new StringBuilder();
            csv.AppendLine("VoertuigId,Merk,Type,Kenteken,Status,Huurder,Verhuurdatum");

            foreach (var v in verhuurdeVoertuigen)
            {
                var huurVerzoek = v.Huurverzoeken.FirstOrDefault();
                var huurderNaam = huurVerzoek?.Huurder?.Naam ?? "Onbekend";
                var verhuurDatum = huurVerzoek?.StartDatum.ToString("yyyy-MM-dd") ?? "Onbekend";

                csv.AppendLine($"{v.VoertuigId},{v.Merk},{v.Type},{v.Kenteken},{v.Status},{huurderNaam},{verhuurDatum}");
            }
            
            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", "VerhuurdeVoertuigen.csv");
        }
    }
}
