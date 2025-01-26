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
        
        // Haal specifieke uitgifte op
        [HttpGet("{id}")]
        public async Task<ActionResult<Uitgifte>> GetUitgifte(int id)
        {
            var uitgifte = await _context.Uitgiftes
                .Include(u => u.Voertuig)
                .Include(u => u.Huurder)
                .FirstOrDefaultAsync(u => u.UitgifteID == id);

            if (uitgifte == null)
            {
                return NotFound(new { message = "Uitgifte niet gevonden" });
            }
            return Ok(new
            {
                uitgifte.UitgifteID,
                uitgifte.VoertuigID,
                Voertuig = uitgifte.Voertuig.Soort,
                uitgifte.Huurder.Naam,
                uitgifte.Huurder.Email,
                uitgifte.Huurder.Telefoonnummer,
                uitgifte.Status,
                uitgifte.DatumUitgifte,
                uitgifte.BeginKilometerstand,
                uitgifte.Opmerkingen
            });
        }

        // Bevestig uitgifte
        [HttpPut("bevestigen/{id}")]
        public async Task<IActionResult> BevestigUitgifte(int id, [FromBody] Uitgifte uitgifteDetails)
        {
            var uitgifte = await _context.Uitgiftes.FindAsync(id);
            if (uitgifte == null)
            {
                return NotFound(new { message = "Uitgifte niet gevonden" });
            }

            // Werk de uitgifte details bij
            uitgifte.BeginKilometerstand = uitgifteDetails.BeginKilometerstand;
            uitgifte.Opmerkingen = uitgifteDetails.Opmerkingen;
            uitgifte.Status = "Uitgegeven";
            uitgifte.DatumUitgifte = DateTime.Now;

            var voertuig = await _context.Voertuigen.FindAsync(uitgifte.VoertuigID);
            if (voertuig != null)
            {
                voertuig.Status = "Uitgegeven"; // Verander de status van het voertuig
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Uitgifte succesvol bevestigd" });
        }
        
        // Verwijder uitgifte
        [HttpDelete("{id}")]
        public async Task<IActionResult> VerwijderUitgifte(int id)
        {
            var uitgifte = await _context.Uitgiftes.FindAsync(id);
            if (uitgifte == null)
            {
                return NotFound(new { message = "Uitgifte niet gevonden" });
            }

            _context.Uitgiftes.Remove(uitgifte);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Uitgifte succesvol verwijderd" });
        }

        private bool UitgifteExists(int id)
        {
            return _context.Uitgiftes.Any(e => e.UitgifteID == id);
        }
    }
}