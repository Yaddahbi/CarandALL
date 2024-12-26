
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Dto_s;
using WebApplication1.Models;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public UserController(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        if (!ModelState.IsValid)
        {
            // Retourneer validatiefouten in het model
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
                // Maak zakelijke velden leeg voor particulieren
                userDto.BedrijfsNaam = null;
                userDto.KvkNummer = null;
                break;

            case "Medewerker":
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

        // Probeer de gebruiker aan te maken met Identity
        var result = await _userManager.CreateAsync(user, userDto.Wachtwoord);

        if (result.Succeeded)
        {
            return Ok(new { message = "Gebruiker succesvol aangemaakt." });
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
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("JouwGeheimeSleutelVoorDeWebsiteProject123")); // Gebruik een geheime sleutel
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

