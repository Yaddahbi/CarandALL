using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchadeController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SchadeController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Schade
        [HttpGet]
        public ActionResult<List<Schade>> GetAllSchades()
        {
            var schades = _context.GetAllSchades();
            return Ok(schades);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Schade>> GetSchade(int id)
        {
            var schade = await _context.Schades.FindAsync(id);

            if (schade == null)
            {
                return NotFound();
            }

            return schade;
        }

        // POST: api/Schade
        [HttpPost]
        public async Task<ActionResult<Schade>> PostSchade(Schade schade)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _context.Schades.Add(schade);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetSchade), new { id = schade.SchadeId }, schade);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Er is een fout opgetreden bij het toevoegen van schade." });
            }
        }

        // PUT: api/Schade/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateSchade(int id, Schade schade)
        {
            if (id != schade.SchadeId) return BadRequest("ID mismatch.");

            var existingSchade = _context.GetSchadeById(id);
            if (existingSchade == null) return NotFound();

            _context.UpdateSchade(schade);
            return NoContent();
        }

        // DELETE: api/Schade/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteSchade(int id)
        {
            var schade = _context.GetSchadeById(id);
            if (schade == null) return NotFound();

            _context.DeleteSchade(id);
            return NoContent();
        }
    }
}