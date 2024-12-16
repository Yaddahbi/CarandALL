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
    public class InnameController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public InnameController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Innames
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inname>>> GetInnames()
        {
            return await _context.Innames.Include(i => i.Voertuig).Include(i => i.Huurder).ToListAsync();
        }

        // GET: api/Innames/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Inname>> GetInname(int id)
        {
            var inname = await _context.Innames.Include(i => i.Voertuig).Include(i => i.Huurder)
                .FirstOrDefaultAsync(i => i.InnameID == id);

            if (inname == null)
            {
                return NotFound();
            }

            return inname;
        }

        // POST: api/Innames
        [HttpPost]
        public async Task<ActionResult<Inname>> PostInname(Inname inname)
        {
            _context.Innames.Add(inname);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInname", new { id = inname.InnameID }, inname);
        }

        // PUT: api/Innames/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInname(int id, Inname inname)
        {
            if (id != inname.InnameID)
            {
                return BadRequest();
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
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Innames/5
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
    }
}
