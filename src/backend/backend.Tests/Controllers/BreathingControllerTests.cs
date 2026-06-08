using backend.Controllers;
using backend.DTOs;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

public class BreathingControllerTests
{
    private readonly Mock<IBreathingService> _serviceMock = new();
    private readonly BreathingController _controller;

    public BreathingControllerTests()
    {
        _controller = new BreathingController(_serviceMock.Object);
    }

    [Fact]
    public async Task Post_WithValidClaim_ReturnsOk()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        var request = new BreathingRequest
        {
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddMinutes(5),
            BreathingType = 1
        };

        _serviceMock
            .Setup(s => s.SaveSessionAsync(userId.ToString(), request))
            .Returns(Task.CompletedTask);

        var result = await _controller.Post(request);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
        _serviceMock.Verify(s => s.SaveSessionAsync(userId.ToString(), request), Times.Once);
    }

    [Fact]
    public async Task Post_WithoutClaim_ReturnsUnauthorized()
    {
        ControllerTestHelper.SetUserWithoutClaims(_controller);

        var request = new BreathingRequest
        {
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddMinutes(5),
            BreathingType = 1
        };

        var result = await _controller.Post(request);

        Assert.IsType<UnauthorizedResult>(result);
        _serviceMock.Verify(s => s.SaveSessionAsync(It.IsAny<string>(), It.IsAny<BreathingRequest>()), Times.Never);
    }
}
