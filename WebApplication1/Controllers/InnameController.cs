using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApplication1.Controllers
{
    [Authorize(Roles = "FrontOffice")]
    [Route("api/[controller]")]
    [ApiController]
    public class InnameController : ControllerBase
    {
        private readonly DatabaseContext _context;
        public InnameController(DatabaseContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inname>>> GetInnames()
        {
            var innames = await _context.Innames
                .Include(i => i.Voertuig) 
                .Include(i => i.Huurder)  
                .ToListAsync();

            if (!innames.Any())
                return NotFound("Geen innamegegevens gevonden.");

            return Ok(innames);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Inname>> GetInname(int id)
        {
            var inname = await _context.Innames
                .Include(i => i.Voertuig)
                .Include(i => i.Huurder)
                .FirstOrDefaultAsync(i => i.InnameID == id);

            if (inname == null)
                return NotFound("Inname niet gevonden.");

            return Ok(inname);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInname(int id, Inname inname)
        {
            if (id != inname.InnameID)
                return BadRequest("IDs komen niet overeen.");

            var voertuig = await _context.Voertuigen.FindAsync(inname.VoertuigID);
            if (voertuig == null)
                return NotFound("Voertuig niet gevonden.");
            
            voertuig.Status = inname.HeeftSchade ? "Beschadigd" : "Beschikbaar"; 
            inname.DatumInname = DateTime.Now;

            _context.Entry(inname).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Innames.Any(e => e.InnameID == id))
                    return NotFound("Inname niet gevonden.");

                throw;
            }

            return NoContent();
        }
    }
}
