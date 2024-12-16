using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebApplication1.Dto_s;
using WebApplication1.Models;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public UserController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        // Controleer of de DTO geldig is
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // Retourneer alle model validatiefouten
        }

        // Valideer op basis van de rol
        if (userDto.Rol == "Zakelijk")
        {
            if (string.IsNullOrWhiteSpace(userDto.BedrijfsNaam) || string.IsNullOrWhiteSpace(userDto.KvkNummer))
            {
                return BadRequest("Zakelijke gebruikers moeten BedrijfsNaam en KvkNummer invullen.");
            }
        }
        else if (userDto.Rol == "Particulier")
        {
            // Zakelijke velden moeten leeg zijn voor particulieren
            userDto.BedrijfsNaam = null;
            userDto.KvkNummer = null;
        }

        // Maak de gebruiker aan met Identity
        var user = new User
        {
            UserName = userDto.Email,
            Email = userDto.Email,
            Naam = userDto.Naam,
            Adres = userDto.Adres,
            PhoneNumber = userDto.Telefoonnummer,
            IsZakelijk = userDto.Rol == "Zakelijk",
            BedrijfsNaam = userDto.BedrijfsNaam,
            KvkNummer = userDto.KvkNummer
        };

        var result = await _userManager.CreateAsync(user, userDto.Wachtwoord);

        if (result.Succeeded)
        {
            return Ok(new { message = "Gebruiker succesvol aangemaakt." }); // Retourneer succes als JSON
        }

        return BadRequest(result.Errors.Select(e => e.Description));
    }



}
