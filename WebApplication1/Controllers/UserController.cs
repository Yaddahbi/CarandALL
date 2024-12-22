
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
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
        if (!ModelState.IsValid)
        {
            return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
        }

        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return Unauthorized(new { error = "Ongeldige inloggegevens." });
        }

        var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
        if (result.Succeeded)
        {
            return Ok(new { message = "Inloggen succesvol." });
        }

        return Unauthorized(new { error = "Ongeldige inloggegevens." });
    }
}

