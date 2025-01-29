using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Controllers
{
    //[Authorize(Roles = "Backofficemedewerker, Frontofficemedewerker")]
    [ApiController]
    [Route("api/[controller]")]
    public class SchadeController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<SchadeController> _logger;

        public SchadeController(DatabaseContext context, ILogger<SchadeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schade>>> GetSchades()
        {
            var schades = await _context.Schades
                .Include(s => s.Voertuig)
                .Where(s => s.Voertuig != null) // Voorkom dat we schades zonder voertuig ophalen
                .ToListAsync();

            _logger.LogInformation("Fetched {Count} schademeldingen.", schades.Count);
            return Ok(schades);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Schade>> GetSchade(int id)
        {
            var schade = await _context.Schades
                .Include(s => s.Voertuig)
                .FirstOrDefaultAsync(s => s.SchadeId == id);

            if (schade == null)
            {
                _logger.LogWarning("Schade with ID {Id} not found.", id);
                return NotFound(new { Message = $"Schade with ID {id} not found." });
            }

            return Ok(schade);
        }
        
        [HttpPost]
        public async Task<ActionResult<Schade>> CreateSchademelding([FromBody] Schade schade)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var voertuig = await _context.Voertuigen.FindAsync(schade.VoertuigId);
            if (voertuig == null)
            {
                return BadRequest(new { Message = "Voertuig not found." });
            }

            // Status voertuig direct op "In Reparatie" zetten
            voertuig.Status = "In Reparatie";
            _context.Entry(voertuig).State = EntityState.Modified;

            _context.Schades.Add(schade);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created a new schademelding with ID {Id}.", schade.SchadeId);
            return CreatedAtAction(nameof(GetSchade), new { id = schade.SchadeId }, schade);
        }
        
        [HttpPost("{schadeId}/uploadFoto")]
        public async Task<IActionResult> UploadSchadeFoto(int schadeId, IFormFile foto)
        {
            if (foto == null || foto.Length == 0)
            {
                return BadRequest("Geen bestand geselecteerd.");
            }

            var schade = await _context.Schades.FindAsync(schadeId);
            if (schade == null)
            {
                return NotFound(new { Message = $"Schade with ID {schadeId} not found." });
            }

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "SchadeFoto's");
            Directory.CreateDirectory(folderPath);
            var filePath = Path.Combine(folderPath, $"{schadeId}_{foto.FileName}");

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await foto.CopyToAsync(fileStream);
            }

            _logger.LogInformation("File path: {FilePath}", filePath); // Debug-log

            if (schade.FotoUrls == null)
            {
                schade.FotoUrls = new List<string>();
            }

            schade.FotoUrls.Add(filePath);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Foto succesvol geüpload", filePath });
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchademelding(int id, [FromBody] Schade updateSchade)
        {
            if (id != updateSchade.SchadeId)
            {
                return BadRequest(new { Message = "Schade ID does not match." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schade = await _context.Schades.FindAsync(id);
            if (schade == null)
            {
                _logger.LogWarning("Schade with ID {Id} not found.", id);
                return NotFound(new { Message = $"Schade with ID {id} not found." });
            }

            schade.Status = updateSchade.Status;
            schade.Opmerkingen = updateSchade.Opmerkingen;
            
            if (updateSchade.Status == "Afgesloten" && schade.Voertuig != null)
            {
                schade.Voertuig.Status = "Beschikbaar";
                _context.Entry(schade.Voertuig).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated schademelding with ID {Id}.", id);
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchade(int id)
        {
            var schade = await _context.Schades.FindAsync(id);
            if (schade == null)
            {
                _logger.LogWarning("Schade with ID {Id} not found.", id);
                return NotFound(new { Message = $"Schade with ID {id} not found." });
            }

            _context.Schades.Remove(schade);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted schademelding with ID {Id}.", id);
            return NoContent();
        }
    }
}