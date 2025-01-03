using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AbonnementController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<User> _userManager;

        public AbonnementController(DatabaseContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("medewerkers")]
        public async Task<IActionResult> GetMedewerkers()
        {
            // Haal het huidige gebruiker ID en abonnement ID uit de claims
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var abonnementId = User.FindFirst("AbonnementId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(abonnementId))
            {
                return Unauthorized(new { error = "Gebruiker of abonnement niet geauthenticeerd." });
            }

            // Controleer of de gebruiker rechten heeft om medewerkers te bekijken
            var abonnement = await _context.Abonnementen.FindAsync(int.Parse(abonnementId));
            if (abonnement == null)
            {
                return NotFound(new { message = "Abonnement niet gevonden." });
            }

            // Haal medewerkers op die aan dit abonnement gekoppeld zijn
            var medewerkers = await _context.Users
                .Where(u => u.BedrijfsAbonnementId == int.Parse(abonnementId))
                .Select(u => new
                {
                    u.Id,
                    u.Naam,
                    u.Email,
                    u.Rol,
                })
                .ToListAsync();

            return Ok(medewerkers);
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

        [Authorize]
        [HttpPost("add-medewerker")]
        public async Task<IActionResult> AddMedewerker([FromBody] AddMedewerkerDto medewerkerDto)
        {
            // Haal het gebruikers ID en abonnement ID uit de claims
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var abonnementIdClaim = User.FindFirst("AbonnementId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(abonnementIdClaim))
            {
                return Unauthorized(new { error = "Gebruiker of abonnement niet geauthenticeerd." });
            }

            // Probeer het abonnementId om te zetten naar een integer
            if (!int.TryParse(abonnementIdClaim, out int abonnementId))
            {
                return Unauthorized(new { error = "Ongeldig abonnement ID." });
            }

            // Zoek het abonnement op via het abonnementId
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

            // Zoek de medewerker op via hun e-mail
            var medewerker = await _userManager.FindByEmailAsync(medewerkerDto.Email);
            if (medewerker == null)
            {
                return NotFound(new { message = "Gebruiker met opgegeven e-mailadres niet gevonden." });
            }

            // Controleer of het aantal medewerkers het maximale aantal overschrijdt
            var medewerkersCount = await _context.Users.CountAsync(u => u.BedrijfsAbonnementId == abonnementId);
            if (medewerkersCount >= abonnement.MaxMedewerkers)
            {
                return BadRequest(new { message = "Maximaal aantal medewerkers bereikt voor dit abonnement." });
            }

            // Update de rol van de medewerker en koppel het abonnement aan de medewerker
            medewerker.Rol = "Zakelijk";
            medewerker.BedrijfsAbonnementId = abonnementId;

            var updateResult = await _userManager.UpdateAsync(medewerker);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            var notificatie = new Notificatie
            {
                GebruikerId = medewerker.Id,
                Bericht = "Uw account is bijgewerkt naar een zakelijke rol en gekoppeld aan een abonnement.",
            };

            _context.Notificaties.Add(notificatie);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Medewerker succesvol toegevoegd aan het abonnement." });
        }



        [Authorize]
        [HttpDelete("remove-medewerker/{medewerkerId}")]
        public async Task<IActionResult> RemoveMedewerker(string medewerkerId)
        {
            // Haal het huidige gebruiker ID en abonnement ID uit de claims
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var abonnementId = User.FindFirst("AbonnementId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(abonnementId))
            {
                return Unauthorized(new { error = "Gebruiker of abonnement niet geauthenticeerd." });
            }

            // Zoek de medewerker in de database
            var medewerker = await _userManager.FindByIdAsync(medewerkerId);
            if (medewerker == null || medewerker.BedrijfsAbonnementId != int.Parse(abonnementId))
            {
                return NotFound(new { message = "Medewerker niet gevonden of niet gekoppeld aan dit abonnement." });
            }

            // Verwijder medewerker uit het abonnement
            medewerker.Rol = "Particulier";
            medewerker.BedrijfsAbonnementId = null;

            var updateResult = await _userManager.UpdateAsync(medewerker);
            if (!updateResult.Succeeded)
            {
                var errors = updateResult.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            // Stuur notificaties
            var notificatieVoorMedewerker = new Notificatie
            {
                GebruikerId = medewerker.Id,
                Bericht = "Je bent verwijderd van het bedrijfsabonnement.",
                DatumTijd = DateTime.Now,
                IsGelezen = false
            };

            var notificatieVoorZakelijkeGebruiker = new Notificatie
            {
                GebruikerId = userId,
                Bericht = $"Medewerker {medewerker.Email} is succesvol verwijderd van het abonnement.",
                DatumTijd = DateTime.Now,
                IsGelezen = false
            };

            _context.Notificaties.AddRange(notificatieVoorMedewerker, notificatieVoorZakelijkeGebruiker);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Medewerker succesvol verwijderd van het abonnement." });
        }

    }

    public class AddMedewerkerDto
    {
        public string Email { get; set; }
    }

}
