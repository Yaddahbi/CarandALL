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

        // GET: api/Schade/{id}
        [HttpGet("{id}")]
        public ActionResult<Schade> GetSchadeById(int id)
        {
            var schade = _context.GetSchadeById(id);
            if (schade == null) return NotFound();
            return Ok(schade);
        }

        // POST: api/Schade
        [HttpPost]
        public ActionResult CreateSchade(Schade schade)
        {
            _context.CreateSchade(schade);
            return CreatedAtAction(nameof(GetSchadeById), new { id = schade.SchadeId }, schade);
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