using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using WebApplication1.Controllers;
using WebApplication1.Models;
using Moq;
using WebApplication1;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using WebApplication1.Dto_s;

namespace BackendTesten
{
    public class RegisterTests
    {
        private readonly UserController _controller;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessor;
        private readonly Mock<IUserClaimsPrincipalFactory<User>> _userClaimsPrincipalFactory;

        public RegisterTests()
        {
            // Mocking the UserManager for user-related actions
            var userStore = new Mock<IUserStore<User>>();
            var userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);

            // Mocking the IHttpContextAccessor to prevent ArgumentNullException
            _httpContextAccessor = new Mock<IHttpContextAccessor>();

            // Mocking the IUserClaimsPrincipalFactory
            _userClaimsPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();

            // Mocking the SignInManager for user-related actions
            var signInManager = new Mock<SignInManager<User>>(userManager.Object, _httpContextAccessor.Object, _userClaimsPrincipalFactory.Object, null, null, null, null);

            // Mocking the DatabaseContext for user-related actions
            var dbContext = new Mock<DatabaseContext>();

            _controller = new UserController(userManager.Object, signInManager.Object, dbContext.Object);

            // Initialize controller context for simulating user authentication
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }, "TestAuthentication"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenRequiredFieldsAreMissing_ForZakelijkeKlant()
        {
            // Arrange
            var userDto = new UserDto
            {
                Email = "zakelijk@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "Password123!",
                Rol = "ZakelijkeKlant",
                // Missing BedrijfsNaam and KvkNummer
            };

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var returnValue = Assert.IsType<IDictionary<string, IEnumerable<string>>>(badRequestResult.Value);
            Assert.Contains("Zakelijke gebruikers moeten BedrijfsNaam en KvkNummer invullen.", returnValue["errors"]);
        }

        [Fact]
        public async Task Register_ReturnsOkResult_ForParticulierRole_WhenRequiredFieldsAreNotNeeded()
        {
            // Arrange
            var userDto = new UserDto
            {
                Email = "particulier@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "Password123!",
                Rol = "Particulier",
                // BedrijfsNaam and KvkNummer can be null for Particulier
            };

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenInvalidRoleIsProvided()
        {
            // Arrange
            var userDto = new UserDto
            {
                Email = "invalidrole@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "Password123!",
                Rol = "InvalidRole", // Invalid role
            };

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var returnValue = Assert.IsType<IDictionary<string, IEnumerable<string>>>(badRequestResult.Value);
            Assert.Contains("Ongeldige rol opgegeven.", returnValue["errors"]);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenPasswordsDoNotMatch()
        {
            // Arrange
            var userDto = new UserDto
            {
                Email = "test@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "DifferentPassword123!",
                Rol = "Particulier",
            };

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var returnValue = Assert.IsType<IDictionary<string, IEnumerable<string>>>(badRequestResult.Value);
            Assert.Contains("Wachtwoorden komen niet overeen.", returnValue["errors"]);
        }
    }
}
