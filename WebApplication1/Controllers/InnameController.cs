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
            return await _context.Innames
                .Include(i => i.Voertuig)
                .Include(i => i.Huurder)
                .ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Inname>> GetInname(int id)
        {
            var inname = await _context.Innames
                .Include(i => i.Voertuig)
                .Include(i => i.Huurder)
                .FirstOrDefaultAsync(i => i.InnameID == id);

            if (inname == null)
            {
                return NotFound("Inname niet gevonden.");
            }

            return inname;
        }
        
        [HttpPost]
        public async Task<ActionResult<Inname>> PostInname(Inname inname)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var voertuig = await _context.Voertuigen.FindAsync(inname.VoertuigID);
            if (voertuig == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            var huurder = await _context.Huurders.FindAsync(inname.HuurderID);
            if (huurder == null)
            {
                return NotFound("Huurder niet gevonden.");
            }
            
            if (inname.HeeftSchade)
            {
                voertuig.Status = "Beschadigd";
            }
            else
            {
                voertuig.Status = "Beschikbaar";
            }
            
            inname.DatumInname = DateTime.Now; 
            _context.Innames.Add(inname);
            await _context.SaveChangesAsync();
            
            await VerstuurBevestigingsmail(huurder, inname);

            return CreatedAtAction("GetInname", new { id = inname.InnameID }, inname);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInname(int id, Inname inname)
        {
            if (id != inname.InnameID)
            {
                return BadRequest("IDs komen niet overeen.");
            }

            _context.Entry(inname).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InnameExists(id))
                {
                    return NotFound("Inname niet gevonden.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInname(int id)
        {
            var inname = await _context.Innames.FindAsync(id);
            if (inname == null)
            {
                return NotFound();
            }

            _context.Innames.Remove(inname);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InnameExists(int id)
        {
            return _context.Innames.Any(e => e.InnameID == id);
        }

        private async Task VerstuurBevestigingsmail(Huurder huurder, Inname inname)
        {
            // Dit is een vereenvoudigd voorbeeld. Vervang door echte mailfunctionaliteit.
            Console.WriteLine($"Bevestigingsmail verstuurd naar {huurder.Email}:");
            Console.WriteLine($"Voertuig met ID {inname.VoertuigID} is succesvol ingenomen.");
            await Task.CompletedTask;
        }
    }
}
