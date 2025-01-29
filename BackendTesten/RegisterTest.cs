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
            
            var userStore = new Mock<IUserStore<User>>();
            var userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);

            
            _httpContextAccessor = new Mock<IHttpContextAccessor>();

           
            _userClaimsPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();

            var signInManager = new Mock<SignInManager<User>>(userManager.Object, _httpContextAccessor.Object, _userClaimsPrincipalFactory.Object, null, null, null, null);

            
            var dbContext = new Mock<DatabaseContext>();

            _controller = new UserController(userManager.Object, signInManager.Object, dbContext.Object);

            
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
        
            var userDto = new UserDto
            {
                Email = "zakelijk@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "Password123!",
                Rol = "ZakelijkeKlant",
               
            };

        
            var result = await _controller.Register(userDto);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var returnValue = Assert.IsType<IDictionary<string, IEnumerable<string>>>(badRequestResult.Value);
            Assert.Contains("Zakelijke gebruikers moeten BedrijfsNaam en KvkNummer invullen.", returnValue["errors"]);
        }

        [Fact]
        public async Task Register_ReturnsOkResult_ForParticulierRole_WhenRequiredFieldsAreNotNeeded()
        {
            
            var userDto = new UserDto
            {
                Email = "particulier@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "Password123!",
                Rol = "Particulier",
                
            };

          
            var result = await _controller.Register(userDto);

           
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenInvalidRoleIsProvided()
        {
            
            var userDto = new UserDto
            {
                Email = "invalidrole@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "Password123!",
                Rol = "InvalidRole", 
            };

           
            var result = await _controller.Register(userDto);

           
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var returnValue = Assert.IsType<IDictionary<string, IEnumerable<string>>>(badRequestResult.Value);
            Assert.Contains("Ongeldige rol opgegeven.", returnValue["errors"]);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenPasswordsDoNotMatch()
        {
            
            var userDto = new UserDto
            {
                Email = "test@example.com",
                Wachtwoord = "Password123!",
                ConfirmPassword = "DifferentPassword123!",
                Rol = "Particulier",
            };

            
            var result = await _controller.Register(userDto);

            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var returnValue = Assert.IsType<IDictionary<string, IEnumerable<string>>>(badRequestResult.Value);
            Assert.Contains("Wachtwoorden komen niet overeen.", returnValue["errors"]);
        }
    }
}
