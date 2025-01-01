
using Humanizer;
using Microsoft.AspNetCore.Authentication;
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
                case "Zakelijk":
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
                if (userDto.Rol == "Zakelijk")
                {
                    var abonnement = new Abonnement
                    {
                        BedrijfsDomein = userDto.BedrijfsNaam.ToLower().Replace(" ", "") + ".com",
                        AbonnementType = "Pay-as-you-go", // Standaard abonnementstype
                    };

                    abonnement.MaxMedewerkers = abonnement.AbonnementType == "Prepaid" ? 100 : 50;

                    _context.Abonnementen.Add(abonnement);
                    await _context.SaveChangesAsync();

                    // Koppel het abonnement aan de gebruiker
                    user.BedrijfsAbonnementId = abonnement.Id;
                    await _userManager.UpdateAsync(user);

                    // Maak een melding dat het abonnement is aangemaakt
                    return Ok(new { message = "Zakelijke gebruiker succesvol aangemaakt en abonnement aangemaakt." });
                }
                else
                {
                    return Ok(new { message = "Particuliere gebruiker succesvol aangemaakt." });
                }
            }

            // Retourneer eventuele fouten van Identity
            var identityErrors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { errors = identityErrors });
        }


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

            // Claims voor JWT-token
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id), // Gebruikers ID
        new Claim(ClaimTypes.Role, user.Rol) // Rol van de gebruiker
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

            // Return de token naar de frontend
            return Ok(new { message = "Inloggen succesvol.", token = tokenString, role = user.Rol });
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok(new { message = "Uitloggen succesvol." });
        }

    }
}
