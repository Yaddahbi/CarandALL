using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UitgiftesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UitgiftesController(DatabaseContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uitgifte>>> GetUitgiftes()
        {
            return await _context.Uitgiftes
                .Include(u => u.Voertuig)
                .Include(u => u.Huurder)
                .ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Uitgifte>> GetUitgifte(int id)
        {
            var uitgifte = await _context.Uitgiftes
                .Include(u => u.Voertuig)
                .Include(u => u.Huurder)
                .FirstOrDefaultAsync(u => u.UitgifteID == id);

            if (uitgifte == null)
            {
                return NotFound();
            }

            return uitgifte;
        }

      
        [HttpPost]
        public async Task<ActionResult<Uitgifte>> PostUitgifte(Uitgifte uitgifte)
        {
            _context.Uitgiftes.Add(uitgifte);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUitgifte", new { id = uitgifte.UitgifteID }, uitgifte);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUitgifte(int id, Uitgifte uitgifte)
        {
            if (id != uitgifte.UitgifteID)
            {
                return BadRequest();
            }

            _context.Entry(uitgifte).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UitgifteExists(id))
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
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUitgifte(int id)
        {
            var uitgifte = await _context.Uitgiftes.FindAsync(id);
            if (uitgifte == null)
            {
                return NotFound();
            }

            _context.Uitgiftes.Remove(uitgifte);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UitgifteExists(int id)
        {
            return _context.Uitgiftes.Any(e => e.UitgifteID == id);
        }
    }
}