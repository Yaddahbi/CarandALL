using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [Authorize(Roles = "Backofficemedewerker")] 
    [ApiController]
    [Route("api/[controller]")]
    public class SchadeController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public SchadeController(DatabaseContext context)
        {
            _context = context;
        }

 [HttpGet("schademeldingen")]
        public async Task<ActionResult<List<Schade>>> GetAllSchades()
        {
            var schades = await _context.Schades
                .Include(s => s.Voertuig)  
                .ToListAsync();

            if (schades == null || !schades.Any())
            {
                return NotFound("Geen schademeldingen gevonden.");
            }

            return Ok(schades);
        }

   
        [HttpGet("{id}")]
        public async Task<ActionResult<Schade>> GetSchadeById(int id)
        {
            var schade = await _context.Schades
                .Include(s => s.Voertuig)  
                .FirstOrDefaultAsync(s => s.SchadeId == id);

            if (schade == null)
            {
                return NotFound("Schade niet gevonden.");
            }

            return Ok(schade);
        }

       
        [HttpPost]
        public async Task<ActionResult> CreateSchade([FromBody] Schade schade)
        {
            if (schade == null)
            {
                return BadRequest("Ongeldige schadegegevens.");
            }

            _context.Schades.Add(schade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchadeById), new { id = schade.SchadeId }, schade);
        }


        [HttpPut("{id}/inreparatie")]
        public async Task<ActionResult> MarkeerSchadeInReparatie(int id)
        {
            var schade = await _context.Schades
                .Include(s => s.Voertuig)  // Zorg ervoor dat we de gekoppelde voertuig kunnen bijwerken
                .FirstOrDefaultAsync(s => s.SchadeId == id);

            if (schade == null)
            {
                return NotFound("Schade niet gevonden.");
            }

            
            if (schade.Status == "Afgehandeld")
            {
                return BadRequest("De schade is al afgehandeld en kan niet meer in reparatie worden gezet.");
            }

           
            schade.Status = "In reparatie";
            _context.Schades.Update(schade);

            
            if (schade.Voertuig != null)
            {
                schade.Voertuig.Status = "In reparatie";
                _context.Voertuigen.Update(schade.Voertuig);
            }

            await _context.SaveChangesAsync();
            return Ok("Schade gemarkeerd als 'In reparatie' en voertuigstatus bijgewerkt.");
        }

        
        [HttpPost("schadeclaims")]
        public async Task<ActionResult> CreateSchadeclaim([FromBody] Schadeclaim schadeclaim)
        {
            if (schadeclaim == null)
            {
                return BadRequest("Ongeldige schadeclaim.");
            }

            
            var schade = await _context.Schades.FindAsync(schadeclaim.SchadeId);
            if (schade == null)
            {
                return BadRequest("De opgegeven schade bestaat niet.");
            }

            
            _context.Schadeclaims.Add(schadeclaim);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchadeclaimById), new { id = schadeclaim.SchadeclaimId }, schadeclaim);
        }

        // 6. Schadeclaim Bekijken
        [HttpGet("schadeclaims/{id}")]
        public async Task<ActionResult<Schadeclaim>> GetSchadeclaimById(int id)
        {
            var schadeclaim = await _context.Schadeclaims
                .Include(s => s.Schade)  // Inclusief schade-informatie
                .FirstOrDefaultAsync(s => s.SchadeclaimId == id);

            if (schadeclaim == null)
            {
                return NotFound("Schadeclaim niet gevonden.");
            }

            return Ok(schadeclaim);
        }

        // 7. Schadeclaim Status Bijwerken (In Behandeling / Afgehandeld)
        [HttpPut("schadeclaims/{id}/update-status")]
        public async Task<ActionResult> UpdateSchadeclaimStatus(int id, [FromBody] string status)
        {
            if (status != "In behandeling" && status != "Afgehandeld")
            {
                return BadRequest("Status moet 'In behandeling' of 'Afgehandeld' zijn.");
            }

            var schadeclaim = await _context.Schadeclaims.FindAsync(id);
            if (schadeclaim == null)
            {
                return NotFound("Schadeclaim niet gevonden.");
            }

            schadeclaim.Status = status;
            _context.Schadeclaims.Update(schadeclaim);
            await _context.SaveChangesAsync();

            return Ok("Schadeclaim status succesvol bijgewerkt.");
        }

        // 8. Reparatie Details Toevoegen aan Schadeclaim
        [HttpPut("schadeclaims/{id}/add-reparatie-details")]
        public async Task<ActionResult> AddReparatieDetails(int id, [FromBody] string reparatieDetails)
        {
            var schadeclaim = await _context.Schadeclaims.FindAsync(id);
            if (schadeclaim == null)
            {
                return NotFound("Schadeclaim niet gevonden.");
            }

            schadeclaim.ReparatieDetails = reparatieDetails;
            _context.Schadeclaims.Update(schadeclaim);
            await _context.SaveChangesAsync();

            return Ok("Reparatie details toegevoegd aan de schadeclaim.");
        }
    }
}