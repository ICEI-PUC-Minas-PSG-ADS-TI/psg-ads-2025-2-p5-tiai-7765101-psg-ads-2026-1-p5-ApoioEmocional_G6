using backend.Controllers;
using backend.DTOs;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

public class EmotionsControllerTests
{
    private readonly Mock<IEmotionService> _serviceMock = new();
    private readonly EmotionsController _controller;

    public EmotionsControllerTests()
    {
        _controller = new EmotionsController(_serviceMock.Object);
    }

    [Fact]
    public async Task Post_ValidRequest_ReturnsCreated()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        var response = new EmotionResponse
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Mood = "Bom",
            CreatedAt = DateTime.UtcNow
        };

        _serviceMock
            .Setup(s => s.RegisterEmotionAsync(It.IsAny<EmotionRequest>(), userId))
            .ReturnsAsync(response);

        var result = await _controller.Post(new EmotionRequest { Mood = "Bom" });

        Assert.IsType<CreatedAtActionResult>(result);
    }

    [Fact]
    public async Task Post_InvalidMood_ReturnsBadRequest()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        _serviceMock
            .Setup(s => s.RegisterEmotionAsync(It.IsAny<EmotionRequest>(), userId))
            .ThrowsAsync(new ArgumentException("Invalid mood value"));

        var result = await _controller.Post(new EmotionRequest { Mood = "Invalid" });

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public async Task Post_CooldownViolation_Returns429()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        _serviceMock
            .Setup(s => s.RegisterEmotionAsync(It.IsAny<EmotionRequest>(), userId))
            .ThrowsAsync(new InvalidOperationException("Registro permitido a cada 8 horas"));

        var result = await _controller.Post(new EmotionRequest { Mood = "Bom" });

        var statusResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(429, statusResult.StatusCode);
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithList()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        var emotions = new List<EmotionResponse>
        {
            new() { Id = Guid.NewGuid(), UserId = userId, Mood = "Bom", CreatedAt = DateTime.UtcNow }
        };

        _serviceMock.Setup(s => s.GetAllAsync(userId)).ReturnsAsync(emotions);

        var result = await _controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(emotions, ok.Value);
    }

    [Fact]
    public async Task GetToday_ReturnsOkWithList()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        var emotions = new List<EmotionResponse>
        {
            new() { Id = Guid.NewGuid(), UserId = userId, Mood = "Otimo", CreatedAt = DateTime.UtcNow }
        };

        _serviceMock.Setup(s => s.GetTodayAsync(userId)).ReturnsAsync(emotions);

        var result = await _controller.GetToday();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(emotions, ok.Value);
    }

    [Fact]
    public async Task GetWeek_ReturnsOkWithGroupedList()
    {
        var userId = Guid.NewGuid();
        ControllerTestHelper.SetUser(_controller, userId);

        var groups = new List<EmotionDailyGroupResponse>
        {
            new()
            {
                Date = DateTime.UtcNow.Date,
                Emotions = new List<EmotionResponse>
                {
                    new() { Id = Guid.NewGuid(), UserId = userId, Mood = "Bom", CreatedAt = DateTime.UtcNow }
                }
            }
        };

        _serviceMock.Setup(s => s.GetThisWeekAsync(userId)).ReturnsAsync(groups);

        var result = await _controller.GetWeek();

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(groups, ok.Value);
    }

    [Fact]
    public async Task GetAll_InvalidClaim_ThrowsUnauthorizedAccessException()
    {
        ControllerTestHelper.SetUserWithoutClaims(_controller);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _controller.GetAll());
    }
}
