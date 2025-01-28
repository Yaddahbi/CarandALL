using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using WebApplication1;
using WebApplication1.Controllers;
using WebApplication1.Dto_s;
using WebApplication1.Models;
using Xunit;

namespace BackendTesten;

public class UitgifteControllerTest
{
    private readonly Mock<DatabaseContext> _contextMock;
    private readonly UitgiftesController _controller;

    public UitgifteControllerTest()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase("TestDatabase") // Gebruik een aparte in-memory database voor testen
            .Options;

        _contextMock = new DatabaseContext(options); // Maak een instantie van je DatabaseContext

        // Voeg enkele testdata toe
        _contextMock.Uitgifte.AddRange(
            new Uitgifte { UserID = 1, Status = "Uitgegeven", VoertuigID = 1, UserID = 1 },
            new Uitgifte { UserID = 2, Status = "In aanvraag", VoertuigID = 2, UserID = 2 }
        );
        _contextMock.SaveChanges();

        // Initialiseer je controller
        _controller = new UitgiftesController(_contextMock);
    }

    [Fact]
    public void GetUitgifte_ReturnsCorrectUitgifte_WhenUitgifteExists()
    {
        // Arrange
        var uitgifteId = 1;

        // Act
        var result = _controller.GetUitgifte(uitgifteId);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Uitgifte>>(result);
        var uitgifte = Assert.IsType<Uitgifte>(actionResult.Value);
        Assert.Equal(uitgifteId, uitgifte.UitgifteID);
    }

    [Fact]
    public void GetUitgifte_ReturnsNotFound_WhenUitgifteDoesNotExist()
    {
        // Arrange
        var uitgifteId = 999; // Gebruik een niet-bestaand ID

        // Act
        var result = _controller.GetUitgifte(uitgifteId);

        // Assert
        var actionResult = Assert.IsType<ActionResult<Uitgifte>>(result);
        Assert.IsType<NotFoundResult>(actionResult.Result); // Verwacht een NotFoundResult
    }
}