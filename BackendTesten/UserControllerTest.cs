using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using WebApplication1.Controllers;
using WebApplication1.Dto_s;
using WebApplication1.Models;
using Xunit;

namespace BackendTesten
{
    public class UserControllerTests
    {
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly Mock<SignInManager<User>> _signInManagerMock;
        private readonly Mock<WebApplication1.DatabaseContext> _contextMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            _userManagerMock = new Mock<UserManager<User>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
            var contextAccessorMock = new Mock<IHttpContextAccessor>();
            var userPrincipalFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();
            _signInManagerMock = new Mock<SignInManager<User>>(_userManagerMock.Object, contextAccessorMock.Object, userPrincipalFactoryMock.Object, null, null, null, null);
            var options = new DbContextOptionsBuilder<WebApplication1.DatabaseContext>().UseInMemoryDatabase(databaseName: "TestDatabase5").Options;
            _contextMock = new Mock<WebApplication1.DatabaseContext>(options);
            _controller = new UserController(_userManagerMock.Object, _signInManagerMock.Object, _contextMock.Object);

            
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "testUserId")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }
        [Fact]
        public async Task Login_ReturnsOkResult_WhenCredentialsAreValid()
        {
            
            var loginDto = new LoginDto { Email = "test@example.com", Password = "Password123" };
            var user = new User { Id = "testUserId", Email = loginDto.Email, UserName = loginDto.Email, Naam = "Test User", Rol = "Particulier", BedrijfsAbonnementId = 1 };

            _userManagerMock.Setup(um => um.FindByEmailAsync(loginDto.Email)).ReturnsAsync(user);
            _signInManagerMock.Setup(sm => sm.PasswordSignInAsync(user, loginDto.Password, false, false)).ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

      
            var result = await _controller.Login(loginDto);

            var okResult = Assert.IsType<OkObjectResult>(result); 
            Assert.Equal(200, okResult.StatusCode); 

            
            var response = Assert.IsType<LoginResponseDto>(okResult.Value);
            Assert.Equal("Inloggen succesvol.", response.Message);
            Assert.NotNull(response.Token); 
            Assert.Equal("Particulier", response.Role);
            Assert.Equal("Test User", response.Name);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorizedResult_WhenCredentialsAreInvalid()
        {

            var loginDto = new LoginDto { Email = "test@example.com", Password = "WrongPassword" };
            var user = new User { Email = loginDto.Email, UserName = loginDto.Email };
            _userManagerMock.Setup(um => um.FindByEmailAsync(loginDto.Email)).ReturnsAsync(user);
            _signInManagerMock.Setup(sm => sm.PasswordSignInAsync(user, loginDto.Password, false, false)).ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

      
            var result = await _controller.Login(loginDto);

            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
        }

        [Fact]
        public async Task Register_ReturnsOkResult_WhenRegistrationIsSuccessful()
        {
        
            var userDto = new UserDto { Email = "test@example.com", Wachtwoord = "Password123", ConfirmPassword = "Password123", Rol = "Particulier" };
            var user = new User { Email = userDto.Email, UserName = userDto.Email };
            _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<User>(), userDto.Wachtwoord)).ReturnsAsync(IdentityResult.Success);

       
            var result = await _controller.Register(userDto);

            
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }
        [Fact]
        public async Task Register_ReturnsBadRequestResult_WhenRegistrationFails()
        {
            
            var userDto = new UserDto { Email = "test@example.com", Wachtwoord = "Password123", ConfirmPassword = "Password123", Rol = "Particulier" };
            var user = new User { Email = userDto.Email, UserName = userDto.Email };
            _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<User>(), userDto.Wachtwoord)).ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Registration failed" }));

        
            var result = await _controller.Register(userDto);

          
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }
    }

   
    public static class DbSetMockExtensions
    {
        public static DbSet<T> ReturnsDbSet<T>(this Mock<DbSet<T>> dbSetMock, IEnumerable<T> data) where T : class
        {
            var queryable = data.AsQueryable();
            dbSetMock.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
            return dbSetMock.Object;
        }
    }
}