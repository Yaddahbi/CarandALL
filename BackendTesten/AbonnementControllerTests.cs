using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using WebApplication1.Controllers;
using WebApplication1.Models;
using Moq;
using WebApplication1;

namespace BackendTesten
{
    public class AbonnementControllerTests
    {
        private readonly DatabaseContext _context;
        private readonly AbonnementController _controller;
        private readonly Mock<UserManager<User>> _userManager;

        public AbonnementControllerTests()
        {
            // Configure InMemory database
            var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new DatabaseContext(options);

            // Mock UserManager
            var userStore = new Mock<IUserStore<User>>();
            _userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);

            _controller = new AbonnementController(_context, _userManager.Object);

            // Simuleer ingelogde gebruiker
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim("AbonnementId", "1")
            }, "TestAuthentication"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            SeedData();
        }

        private void SeedData()
        {
            var abonnement = new Abonnement
            {
                Id = 1,
                BedrijfsDomein = "bedrijf.com",
                AbonnementType = "Prepaid",
                MaxMedewerkers = 2
            };

            var medewerker = new User
            {
                Id = "1",
                Naam = "Jan Jansen",
                Email = "bestaande@bedrijf.com",
                Adres = "Straat 12",
                BedrijfsAbonnementId = 1,
                Rol = "Zakelijk"
            };

            _context.Abonnementen.Add(abonnement);
            _context.Users.Add(medewerker);
            _context.SaveChanges();
        }

        [Fact]
        public async Task NietGeauthenticeerd_AddMedewerker()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(); // Geen gebruiker
            var medewerkerDto = new AddMedewerkerDto { Email = "test@bedrijf.com" };

            // Act
            var result = await _controller.AddMedewerker(medewerkerDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Gebruiker of abonnement niet geauthenticeerd.", unauthorizedResult.Value.GetType().GetProperty("error")?.GetValue(unauthorizedResult.Value));
        }

        [Fact]
        public async Task AbonnementNietGevonden()
        {
            // Arrange
            var medewerkerDto = new AddMedewerkerDto { Email = "test@bedrijf.com" };
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim("AbonnementId", "999") 
            }, "TestAuthentication"));

            // Act
            var result = await _controller.AddMedewerker(medewerkerDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Abonnement niet gevonden.", notFoundResult.Value.GetType().GetProperty("message")?.GetValue(notFoundResult.Value));
        }

        [Fact]
        public async Task OngeldigDomein()
        {
            // Arrange
            var medewerkerDto = new AddMedewerkerDto { Email = "test@verkeerddomein.com" };

            // Act
            var result = await _controller.AddMedewerker(medewerkerDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Alleen e-mailadressen met het domein @bedrijf.com zijn toegestaan.", badRequestResult.Value.GetType().GetProperty("message")?.GetValue(badRequestResult.Value));
        }

        [Fact]
        public async Task MaxMedewerkersBereikt()
        {
            // Arrange
            var medewerkerDto = new AddMedewerkerDto { Email = "test@bedrijf.com" };

            // Voeg medewerkers toe om het maximum te bereiken
            _context.Users.Add(new User { Email = "extra1@bedrijf.com", BedrijfsAbonnementId = 1, Rol = "Zakelijk", Adres = "Straat 10", Naam = "Jan Jansen" });
            _context.Users.Add(new User { Email = "extra2@bedrijf.com", BedrijfsAbonnementId = 1, Rol = "Zakelijk", Adres = "Straat 9", Naam = "Joost Pieters" });
            _context.SaveChanges();

            _userManager.Setup(um => um.FindByEmailAsync(medewerkerDto.Email))
                .ReturnsAsync(new User { Email = medewerkerDto.Email });

            // Act
            var result = await _controller.AddMedewerker(medewerkerDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Maximaal aantal medewerkers bereikt voor dit abonnement.", badRequestResult.Value.GetType().GetProperty("message")?.GetValue(badRequestResult.Value));
        }

        [Fact]
        public async Task MedewerkerSuccesvolToegevoegd()
        {
            // Arrange
            var medewerkerDto = new AddMedewerkerDto { Email = "nieuwemedewerker@bedrijf.com" };

            _userManager.Setup(um => um.FindByEmailAsync(medewerkerDto.Email))
                .ReturnsAsync(new User { Email = medewerkerDto.Email });

            _userManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.AddMedewerker(medewerkerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Medewerker succesvol toegevoegd aan het abonnement.", okResult.Value.GetType().GetProperty("message")?.GetValue(okResult.Value));
        }

        [Fact]
        public async Task NietGeauthenticeerd_RemoveMedewerker()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(); // Geen gebruiker

            // Act
            var result = await _controller.RemoveMedewerker("1");

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Gebruiker of abonnement niet geauthenticeerd.", unauthorizedResult.Value.GetType().GetProperty("error")?.GetValue(unauthorizedResult.Value));
        }

        [Fact]
        public async Task MedewerkerNietGevonden_RemoveMedewerker()
        {
            // Arrange
            var medewerkerId = "999"; // Niet-bestaande medewerker

            // Mock dat FindByIdAsync null retourneert
            _userManager.Setup(um => um.FindByIdAsync(medewerkerId))
                .ReturnsAsync((User)null);

            // Act
            var result = await _controller.RemoveMedewerker(medewerkerId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Medewerker niet gevonden of niet gekoppeld aan dit abonnement.", notFoundResult.Value.GetType().GetProperty("message")?.GetValue(notFoundResult.Value));
        }
        [Fact]
        public async Task UpdateMislukt_RemoveMedewerker()
        {
            // Arrange
            var medewerker = new User
            {
                Id = "3",
                Email = "mislukt@bedrijf.com",
                BedrijfsAbonnementId = 1,
                Rol = "Zakelijk",
                Naam = "Ibrahim Hassan",
                Adres = "Straat 25",
            };

            _context.Users.Add(medewerker);
            _context.SaveChanges();

            // Mock UserManager
            _userManager.Setup(um => um.FindByIdAsync(medewerker.Id))
                .ReturnsAsync(medewerker);

            _userManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Update mislukt" }));

            // Act
            var result = await _controller.RemoveMedewerker("3");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var errors = badRequestResult.Value.GetType().GetProperty("errors")?.GetValue(badRequestResult.Value) as IEnumerable<string>;
            Assert.Contains("Update mislukt", errors);
        }

        [Fact]
        public async Task MedewerkerSuccesvolVerwijderd()
        {
            // Arrange
            var medewerker = new User
            {
                Id = "2",
                Email = "teverwijderen@bedrijf.com",
                BedrijfsAbonnementId = 1,
                Rol = "Zakelijk",
                Naam = "Hansie Krik",
                Adres = "Straat 15",
            };

            _context.Users.Add(medewerker);
            _context.SaveChanges();

            // Mock UserManager UpdateAsync
            _userManager.Setup(um => um.FindByIdAsync(medewerker.Id))
                .ReturnsAsync(medewerker);

            _userManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.RemoveMedewerker("2");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Medewerker succesvol verwijderd van het abonnement.", okResult.Value.GetType().GetProperty("message")?.GetValue(okResult.Value));
        }

    }
}
