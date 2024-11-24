using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [FromQuery] string? type = null,
        [FromQuery] string? kleur = null,
        [FromQuery] int? vanafAanschafjaar = null,
        [FromQuery] int? totAanschafjaar = null)
        {
            var query = _context.Voertuigen.AsQueryable();

            if (!string.IsNullOrEmpty(type))
                query = query.Where(v => v.Type == type);

            if (!string.IsNullOrEmpty(kleur))
                query = query.Where(v => v.Kleur == kleur);

            if (vanafAanschafjaar.HasValue)
                query = query.Where(v => v.Aanschafjaar >= vanafAanschafjaar.Value);

            if (totAanschafjaar.HasValue)
                query = query.Where(v => v.Aanschafjaar <= totAanschafjaar.Value);

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
    }
}
