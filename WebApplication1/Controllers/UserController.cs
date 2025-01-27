
using Humanizer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Dto_s;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly DatabaseContext _context;

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager, DatabaseContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }
        //Een API-endpoint POST om user te laten registreren.

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                return BadRequest(new { errors });
            }

            // Valideer op basis van de rol
            switch (userDto.Rol)
            {
                case "ZakelijkeKlant":
                    if (string.IsNullOrWhiteSpace(userDto.BedrijfsNaam) || string.IsNullOrWhiteSpace(userDto.KvkNummer))
                    {
                        return BadRequest(new { errors = new[] { "Zakelijke gebruikers moeten BedrijfsNaam en KvkNummer invullen." } });
                    }
                    break;

                case "Particulier":
                    userDto.BedrijfsNaam = null;
                    userDto.KvkNummer = null;
                    break;

                default:
                    return BadRequest(new { errors = new[] { "Ongeldige rol opgegeven." } });
            }

            // Maak een nieuwe gebruiker aan
            var user = new User
            {
                UserName = userDto.Email,
                Email = userDto.Email,
                Naam = userDto.Naam,
                Adres = userDto.Adres,
                PhoneNumber = userDto.Telefoonnummer,
                Rol = userDto.Rol,
                BedrijfsNaam = userDto.BedrijfsNaam,
                KvkNummer = userDto.KvkNummer      
            };

            var result = await _userManager.CreateAsync(user, userDto.Wachtwoord);

            if (result.Succeeded)
            {
                // Indien Zakelijk, maak een abonnement aan en koppel het
                if (userDto.Rol == "ZakelijkeKlant")
                {
                    var abonnement = new Abonnement
                    {
                        AbonnementType = userDto.AbonnementType, 
                    };

                    var emailDomain = userDto.Email.Substring(userDto.Email.IndexOf('@') + 1);
                    abonnement.BedrijfsDomein = emailDomain.ToLower();

                    abonnement.KostenPerMaand = abonnement.AbonnementType == "Prepaid" ? 200 : 0;
                    abonnement.MaxMedewerkers = abonnement.AbonnementType == "Prepaid" ? 100 : 50;

                    _context.Abonnementen.Add(abonnement);
                    await _context.SaveChangesAsync();

                    // Koppel het abonnement aan de gebruiker
                    user.BedrijfsAbonnementId = abonnement.Id;
                    await _userManager.UpdateAsync(user);

                    return Ok(new { message = "Zakelijke gebruiker succesvol aangemaakt en abonnement aangemaakt." });
                }
                else
                {
                    return Ok(new { message = "Particuliere gebruiker succesvol aangemaakt." });
                }
            }

            var identityErrors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { errors = identityErrors });
        }

        //Een API-endpoint POST om user te laten inloggen.

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { error = "Ongeldige inloggegevens." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { error = "Ongeldige inloggegevens." });
            }

            var abonnementId = user.BedrijfsAbonnementId;

            // Claims voor JWT-token
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id), // Gebruikers ID
        new Claim(ClaimTypes.Role, user.Rol), // Rol van de gebruiker
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.Naam),
        new Claim("AbonnementId", abonnementId.ToString())
    };

            // Secret key en JWT-instellingen
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("JouwGeheimeSleutelVoorDeWebsiteProject123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Maak een JWT-token aan
            var token = new JwtSecurityToken(
                issuer: "your_issuer", // Zet een geldige issuer in
                audience: "your_audience", // Zet een geldige audience in
                claims: claims,
                expires: DateTime.Now.AddHours(1), // Geldigheidstijd
                signingCredentials: creds
            );

            // Genereer de token als string
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Bouw de response op met een expliciete DTO
            var response = new LoginResponseDto
            {
                Message = "Inloggen succesvol.",
                Token = tokenString,
                Role = user.Rol,
                Name = user.Naam
            };

            return Ok(response);
        }

        //Een API-endpoint POST om user uit te loggen.
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok(new { message = "Uitloggen succesvol." });
        }
        //Een API-endpoint GET om alle notificaties van de gebruiker op te halen.
        [Authorize]
        [HttpGet("notificaties")]
        public async Task<IActionResult> GetNotificaties()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Gebruiker is niet geauthenticeerd." });
            }

            var notificaties = await _context.Notificaties
                .Where(n => n.GebruikerId == userId && !n.IsGelezen)
                .OrderByDescending(n => n.DatumTijd)
                .ToListAsync();

            return Ok(notificaties);
        }
        //Een API-endpoint PUT om een user zijn gegevens te laten updaten.
        [Authorize]
            [HttpPut("update")]
            public async Task<IActionResult> UpdateUser([FromBody] Updateuserdto userDto)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "Gebruiker niet gevonden." });
                }

                user.Naam = userDto.Naam;
                user.Email = userDto.Email;
                user.Adres = userDto.Adres;
                user.PhoneNumber = userDto.Telefoonnummer;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Gegevens succesvol bijgewerkt." });
                }

                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }
            //Een API-endpoint GET om de details van de gebruiker op te halen.
            [Authorize]
            [HttpGet("details")]
            public async Task<IActionResult> GetUserDetails()
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Gebruiker is niet geauthenticeerd." });
                }

                var user = await _userManager.Users
                    .Where(u => u.Id == userId)
                    .Select(u => new
                    {
                        u.Id,
                        u.Naam,
                        u.Email,
                        u.Adres,
                        u.PhoneNumber,
                        u.Rol,
                        u.BedrijfsNaam,
                        u.KvkNummer
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound(new { message = "Gebruiker niet gevonden." });
                }

                return Ok(user);
            }
[Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = "Gebruiker niet gevonden." });
            }

            // Verplaats de gebruiker naar de "verwijderde gebruikers" tabel
            var deletedUser = new DeletedUser
            {
                Id = user.Id,
                Naam = user.Naam,
                Email = user.Email,
                Adres = user.Adres,
                Rol = user.Rol,
                BedrijfsNaam = user.BedrijfsNaam,
                KvkNummer = user.KvkNummer,
                BedrijfsAbonnementId = user.BedrijfsAbonnementId,
                DeletedAt = DateTime.UtcNow
            };

            _context.DeletedUsers.Add(deletedUser);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account succesvol verwijderd." });
        }

        }
    }
