using System.Collections.Generic;
using System.Linq;
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
        private readonly UserController _controller;

        public UserControllerTests()
        {
            var userStoreMock = new Mock<IUserStore<User>>();
            _userManagerMock = new Mock<UserManager<User>>(userStoreMock.Object, null, null, null, null, null, null, null, null);

            _controller = new UserController(_userManagerMock.Object, null, null);

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
        public async Task UpdateUser_ReturnsOkResult_WhenUpdateIsSuccessful()
        {
            // Arrange
            var userDto = new Updateuserdto
            {
                Naam = "Updated Name",
                Email = "updated@example.com",
                Adres = "Updated Address",
                Telefoonnummer = "1234567890"
            };

            var user = new User
            {
                Id = "testUserId",
                Naam = "Original Name",
                Email = "original@example.com",
                Adres = "Original Address",
                PhoneNumber = "0987654321"
            };

            _userManagerMock.Setup(um => um.FindByIdAsync("testUserId")).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.UpdateAsync(It.IsAny<User>())).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.UpdateUser(userDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
            Assert.Equal("Gegevens succesvol bijgewerkt.", okResult.Value.GetType().GetProperty("message")?.GetValue(okResult.Value));
        }

        [Fact]
        public async Task UpdateUser_ReturnsNotFoundResult_WhenUserIsNotFound()
        {
            // Arrange
            var userDto = new Updateuserdto
            {
                Naam = "Updated Name",
                Email = "updated@example.com",
                Adres = "Updated Address",
                Telefoonnummer = "1234567890"
            };

            _userManagerMock.Setup(um => um.FindByIdAsync("testUserId")).ReturnsAsync((User)null);

            // Act
            var result = await _controller.UpdateUser(userDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(404, notFoundResult.StatusCode);
            Assert.Equal("Gebruiker niet gevonden.", notFoundResult.Value.GetType().GetProperty("message")?.GetValue(notFoundResult.Value));
        }

        [Fact]
        public async Task UpdateUser_ReturnsBadRequestResult_WhenUpdateFails()
        {
            // Arrange
            var userDto = new Updateuserdto
            {
                Naam = "Updated Name",
                Email = "updated@example.com",
                Adres = "Updated Address",
                Telefoonnummer = "1234567890"
            };

            var user = new User
            {
                Id = "testUserId",
                Naam = "Original Name",
                Email = "original@example.com",
                Adres = "Original Address",
                PhoneNumber = "0987654321"
            };

            _userManagerMock.Setup(um => um.FindByIdAsync("testUserId")).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.UpdateAsync(It.IsAny<User>())).ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Update failed" }));

            // Act
            var result = await _controller.UpdateUser(userDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequestResult.StatusCode);
            var errors = badRequestResult.Value.GetType().GetProperty("errors")?.GetValue(badRequestResult.Value) as IEnumerable<string>;
            Assert.Contains("Update failed", errors);
        }


}
}

