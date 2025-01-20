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

namespace BackendTesten.Controllers
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
            var options = new DbContextOptionsBuilder<WebApplication1.DatabaseContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _contextMock = new Mock<WebApplication1.DatabaseContext>(options);
            _controller = new UserController(_userManagerMock.Object, _signInManagerMock.Object, _contextMock.Object);

            // Mock the HttpContext to simulate an authenticated user
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
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "Password123" };
            var user = new User { Email = loginDto.Email, UserName = loginDto.Email };
            _userManagerMock.Setup(um => um.FindByEmailAsync(loginDto.Email)).ReturnsAsync(user);
            _signInManagerMock.Setup(sm => sm.PasswordSignInAsync(user, loginDto.Password, false, false)).ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorizedResult_WhenCredentialsAreInvalid()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "WrongPassword" };
            var user = new User { Email = loginDto.Email, UserName = loginDto.Email };
            _userManagerMock.Setup(um => um.FindByEmailAsync(loginDto.Email)).ReturnsAsync(user);
            _signInManagerMock.Setup(sm => sm.PasswordSignInAsync(user, loginDto.Password, false, false)).ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
        }

        [Fact]
        public async Task Register_ReturnsOkResult_WhenRegistrationIsSuccessful()
        {
            // Arrange
            var userDto = new UserDto { Email = "test@example.com", Wachtwoord = "Password123", ConfirmPassword = "Password123", Rol = "Particulier" };
            var user = new User { Email = userDto.Email, UserName = userDto.Email };
            _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<User>(), userDto.Wachtwoord)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Register_ReturnsBadRequestResult_WhenPasswordsDoNotMatch()
        {
            // Arrange
            var userDto = new UserDto { Email = "test@example.com", Wachtwoord = "Password123", ConfirmPassword = "DifferentPassword", Rol = "Particulier" };

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task Register_ReturnsBadRequestResult_WhenRegistrationFails()
        {
            // Arrange
            var userDto = new UserDto { Email = "test@example.com", Wachtwoord = "Password123", ConfirmPassword = "Password123", Rol = "Particulier" };
            var user = new User { Email = userDto.Email, UserName = userDto.Email };
            _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<User>(), userDto.Wachtwoord)).ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Registration failed" }));

            // Act
            var result = await _controller.Register(userDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }

        [Fact]
        public async Task GetNotificaties_ReturnsOkResult_WithNotificaties()
        {
            // Arrange
            var notificaties = new List<Notificatie>
            {
                new Notificatie { Id = 1, GebruikerId = "testUserId", Bericht = "Test bericht 1", DatumTijd = DateTime.Now, IsGelezen = false },
                new Notificatie { Id = 2, GebruikerId = "testUserId", Bericht = "Test bericht 2", DatumTijd = DateTime.Now, IsGelezen = false }
            };
            var notificatiesDbSetMock = new Mock<DbSet<Notificatie>>();
            notificatiesDbSetMock.ReturnsDbSet(notificaties);
            _contextMock.Setup(c => c.Notificaties).Returns(notificatiesDbSetMock.Object);

            // Act
            var result = await _controller.GetNotificaties();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
            var returnValue = Assert.IsType<List<Notificatie>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }

    // Extension method to mock DbSet
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