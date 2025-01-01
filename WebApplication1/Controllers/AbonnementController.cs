using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Zakelijk")]
    public class AbonnementController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;

        public AbonnementController(DatabaseContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAbonnement([FromBody] Abonnement abonnement)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Abonnementen.Add(abonnement);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Bedrijfsabonnement succesvol aangemaakt." });
        }

        [HttpPost("{abonnementId}/add-medewerker")]
        public async Task<IActionResult> AddMedewerker(int abonnementId, [FromBody] AddMedewerkerDto medewerkerDto)
        {
            var abonnement = await _context.Abonnementen.FindAsync(abonnementId);
            if (abonnement == null)
            {
                return NotFound(new { message = "Abonnement niet gevonden." });
            }

            // Dynamische controle van bedrijfsdomein
            string bedrijfsDomein = abonnement.BedrijfsDomein; 
            if (!medewerkerDto.Email.EndsWith($"@{bedrijfsDomein}", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = $"Alleen e-mailadressen met het domein @{bedrijfsDomein} zijn toegestaan." });
            }

            var medewerker = await _userManager.FindByEmailAsync(medewerkerDto.Email);
            if (medewerker == null)
            {
                return NotFound(new { message = "Gebruiker met opgegeven e-mailadres niet gevonden." });
            }

            var medewerkersCount = await _context.Users.CountAsync(u => u.BedrijfsAbonnementId == abonnementId);
            if (medewerkersCount >= abonnement.MaxMedewerkers)
            {
                return BadRequest(new { message = "Maximaal aantal medewerkers bereikt voor dit abonnement." });
            }

            medewerker.Rol = "Zakelijk";
            medewerker.BedrijfsAbonnementId = abonnementId;

            var updateResult = await _userManager.UpdateAsync(medewerker);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            return Ok(new { message = "Medewerker succesvol toegevoegd aan het abonnement." });
        }


        [HttpPost("{id}/remove-medewerker")]
        public async Task<IActionResult> RemoveMedewerker(int id, [FromBody] string email)
        {
            var abonnement = await _context.Abonnementen.Include(a => a.Medewerkers).FirstOrDefaultAsync(a => a.Id == id);
            if (abonnement == null)
                return NotFound("Abonnement niet gevonden.");

            var user = abonnement.Medewerkers.FirstOrDefault(u => u.Email == email);
            if (user == null)
                return NotFound("Medewerker niet gevonden.");

            abonnement.Medewerkers.Remove(user);
            user.BedrijfsAbonnementId = null;

            await _context.SaveChangesAsync();

            // Simuleer notificatie via e-mail
            Console.WriteLine($"Notificatie: {user.Email} verwijderd uit bedrijfsabonnement.");

            return Ok("Medewerker succesvol verwijderd.");
        }
    }

    public class AddMedewerkerDto
    {
        public string Email { get; set; }
    }

}
