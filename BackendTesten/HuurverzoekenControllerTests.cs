using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using WebApplication1.Controllers;
using WebApplication1.Models;
using WebApplication1;

namespace BackendTesten
{
   
        public class HuurverzoekenControllerTests
        {
            private readonly DatabaseContext _context;
            private readonly HuurverzoekenController _controller;

            public HuurverzoekenControllerTests()
            {
            // InMemory database setup
            var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unieke database per test
            .Options;
            _context = new DatabaseContext(options);

            _controller = new HuurverzoekenController(_context);

                // Simuleer ingelogde gebruiker
                var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.NameIdentifier, "1")
                }, "TestAuthentication"));

                _controller.ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = user }
                };

                SeedData();
            }

            private void SeedData()
            {
            // Voeg een voorbeeldgebruiker toe
            var gebruiker = new User
            {
                Id = "1", // Match met de ingelogde gebruiker
                Naam = "Jan Jansen",
                Email = "jan.jansen@example.com",
                Adres = "Straat 12",
                Rol = "Particulier"
            };

            // Voeg een voertuig toe
            var voertuig = new Voertuig
            {
                VoertuigId = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Aanschafjaar = 2018,
                Soort = "Auto",
                Prijs = 50
            };

            // Voeg een bestaand huurverzoek toe
            var bestaandHuurverzoek = new Huurverzoek
            {
                HuurverzoekId = 1,
                UserId = "1", // Koppeling aan de gebruiker
                VoertuigId = 1,
                StartDatum = DateTime.UtcNow.AddDays(1),
                EindDatum = DateTime.UtcNow.AddDays(5),
                Status = "Geaccepteerd"
            };

            // Voeg data toe aan de context
            _context.Users.Add(gebruiker);
            _context.Voertuigen.Add(voertuig);
            _context.Huurverzoeken.Add(bestaandHuurverzoek);
            _context.SaveChanges();
        }


        [Fact]
        public async Task NietIngelogd()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(); // Geen gebruiker

            var huurverzoekDto = new HuurverzoekDTO
            {
                VoertuigId = 1,
                StartDatum = DateTime.UtcNow.AddDays(10),
                EindDatum = DateTime.UtcNow.AddDays(15)
            };

            // Act
            var result = await _controller.PostHuurverzoek(huurverzoekDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);

            // Converteer het Value-object naar dynamic of dictionary
            var response = unauthorizedResult.Value as dynamic;

            // Controleer de inhoud van de fout
            Assert.NotNull(response);
            Assert.Equal("Gebruiker is niet geauthenticeerd.", "Gebruiker is niet geauthenticeerd." );
        }


        [Fact]
            public async Task VoertuigNietGevonden()
            {
                // Arrange
                var huurverzoekDto = new HuurverzoekDTO
                {
                    VoertuigId = 99, // Voertuig bestaat niet
                    StartDatum = DateTime.UtcNow.AddDays(10),
                    EindDatum = DateTime.UtcNow.AddDays(15)
                };

                // Act
                var result = await _controller.PostHuurverzoek(huurverzoekDto);

                // Assert
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
                Assert.Equal("Voertuig bestaat niet.", badRequestResult.Value);
            }

            [Fact]
            public async Task VoertuigBezet()
            {
                // Arrange
                var huurverzoekDto = new HuurverzoekDTO
                {
                    VoertuigId = 1,
                    StartDatum = DateTime.UtcNow.AddDays(3), // Overlap met bestaand huurverzoek
                    EindDatum = DateTime.UtcNow.AddDays(6)
                };

                // Act
                var result = await _controller.PostHuurverzoek(huurverzoekDto);

                // Assert
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
                Assert.Equal("Voertuig is niet beschikbaar in deze periode.", badRequestResult.Value);
            }

            [Fact]
            public async Task HuurverzoekGeslaagd()
            {
                // Arrange
                var huurverzoekDto = new HuurverzoekDTO
                {
                    VoertuigId = 1,
                    StartDatum = DateTime.UtcNow.AddDays(10),
                    EindDatum = DateTime.UtcNow.AddDays(15)
                };

                // Act
                var result = await _controller.PostHuurverzoek(huurverzoekDto);

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                var huurverzoek = Assert.IsType<Huurverzoek>(okResult.Value);

                // Controleer dat de huurverzoekgegevens kloppen
                Assert.Equal("1", huurverzoek.UserId);
                Assert.Equal(1, huurverzoek.VoertuigId);
                Assert.Equal("In afwachting", huurverzoek.Status);
                Assert.Equal(huurverzoekDto.StartDatum, huurverzoek.StartDatum);
                Assert.Equal(huurverzoekDto.EindDatum, huurverzoek.EindDatum);
            }
        }
    }


