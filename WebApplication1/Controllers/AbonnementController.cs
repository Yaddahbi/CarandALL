using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
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
        //Een API-endpoint GET om alle medewerkers van een bedrijfsabonnement op te halen.
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
        //Een API-endpoint GET om de details van een bedrijfsabonnement op te halen.
        [Authorize]
        [HttpGet("details")]
        public async Task<IActionResult> GetAbonnementDetails()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var abonnementId = User.FindFirst("AbonnementId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(abonnementId))
            {
                return Unauthorized(new { error = "Gebruiker of abonnement niet geauthenticeerd." });
            }

            var abonnement = await _context.Abonnementen
                .Where(a => a.Id == int.Parse(abonnementId))
                .Select(a => new
                {
                    a.MaxMedewerkers,
                    a.AbonnementType,
                    a.BedrijfsDomein,
                    a.ToekomstigAbonnementType,
                    a.ToekomstigeKosten,
                    a.WijzigingIngangsdatum
                })
                .FirstOrDefaultAsync();

            if (abonnement == null)
            {
                return NotFound(new { message = "Abonnement niet gevonden." });
            }

            return Ok(abonnement);
        }


        //Een API-endpoint POST om een bedrijfsabonnement aan te maken.
        [HttpPost("create")]
        public async Task<IActionResult> CreateAbonnement([FromBody] Abonnement abonnement)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Abonnementen.Add(abonnement);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Bedrijfsabonnement succesvol aangemaakt." });
        }
        //Een API-endpoint POST om een medewerker toe te voegen aan een bedrijfsabonnement.
        [Authorize]
        [HttpPost("add-medewerker")]
        public async Task<IActionResult> AddMedewerker([FromBody] AddMedewerkerDto medewerkerDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var abonnementIdClaim = User.FindFirst("AbonnementId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(abonnementIdClaim))
            {
                return Unauthorized(new { error = "Gebruiker of abonnement niet geauthenticeerd." });
            }

            if (!int.TryParse(abonnementIdClaim, out int abonnementId))
            {
                return Unauthorized(new { error = "Ongeldig abonnement ID." });
            }

            // Controleer of de gebruiker zijn eigen e-mailadres probeert toe te voegen
            if (string.Equals(medewerkerDto.Email, userEmail, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { message = "U kunt uw eigen e-mailadres niet toevoegen." });
            }

            var abonnement = await _context.Abonnementen.FindAsync(abonnementId);
            if (abonnement == null)
            {
                return NotFound(new { message = "Abonnement niet gevonden." });
            }

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

        //  Een API-endpoint DELETE om een medewerker te verwijderen van een bedrijfsabonnement.
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

        //Een API-endpoint PUT om een bedrijfsabonnement te updaten.
        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateAbonnement([FromBody] UpdateAbonnementDto abonnementDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var abonnementIdClaim = User.FindFirst("AbonnementId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(abonnementIdClaim))
            {
                return Unauthorized(new { error = "Gebruiker of abonnement niet geauthenticeerd." });
            }

            if (!int.TryParse(abonnementIdClaim, out int abonnementId))
            {
                return Unauthorized(new { error = "Ongeldig abonnement ID." });
            }

            var abonnement = await _context.Abonnementen.FindAsync(abonnementId);
            if (abonnement == null)
            {
                return NotFound(new { message = "Abonnement niet gevonden." });
            }

            // Controleer of er al een toekomstige wijziging gepland is
            if (abonnement.ToekomstigAbonnementType != null && abonnement.WijzigingIngangsdatum > DateTime.UtcNow)
            {
                return BadRequest(new
                {
                    message = "Er is al een wijziging gepland die van kracht wordt op " + abonnement.WijzigingIngangsdatum?.ToString("dd-MM-yyyy")
                });
            }

            // Bereken de eerste dag van de volgende maand
            DateTime eersteDagVolgendeMaand = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1).AddMonths(1);

            abonnement.ToekomstigAbonnementType = abonnementDto.NieuwAbonnementType;
            abonnement.ToekomstigeKosten = abonnementDto.NieuweKosten;
            abonnement.WijzigingIngangsdatum = eersteDagVolgendeMaand;
            abonnement.LaatstGewijzigdOp = DateTime.UtcNow;

            var notificatie = new Notificatie
            {
                GebruikerId = userId,
                Bericht = $"Uw abonnement wordt gewijzigd naar '{abonnementDto.NieuwAbonnementType}' met een maandelijkse kost van €{abonnementDto.NieuweKosten:F2}. " +
              $"Deze wijziging gaat in op {eersteDagVolgendeMaand:dd-MM-yyyy}.",
            };

            _context.Notificaties.Add(notificatie);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Abonnement succesvol bijgewerkt. Wijzigingen worden actief op de eerste dag van de volgende maand.",
                toekomstigeWijzigingen = new
                {
                    abonnement.ToekomstigAbonnementType,
                    abonnement.ToekomstigeKosten,
                    abonnement.WijzigingIngangsdatum
                }
            });
        }

        public class UpdateAbonnementDto
        {
            [Required]
            public string NieuwAbonnementType { get; set; }

            [Required]
            [Range(0, double.MaxValue)]
            public decimal NieuweKosten { get; set; }
        }

        public class AddMedewerkerDto
        {
            public string Email { get; set; }
        }

    }
}
