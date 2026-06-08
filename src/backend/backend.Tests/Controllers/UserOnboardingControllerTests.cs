using backend.Controllers;
using backend.DTOs;
using backend.Entities;
using backend.Enum;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

public class UserOnboardingControllerTests
{
    private readonly Mock<IUserOnboardingService> _onboardingMock = new();
    private readonly Mock<IEmotionService> _emotionMock = new();
    private readonly UserOnboardingController _controller;

    public UserOnboardingControllerTests()
    {
        _controller = new UserOnboardingController(_onboardingMock.Object, _emotionMock.Object);
    }

    [Fact]
    public async Task Create_ValidRequest_ReturnsCreated()
    {
        var userId = Guid.NewGuid();
        var request = CreateRequest(userId);
        var created = CreateOnboarding(userId);

        _onboardingMock.Setup(s => s.CreateAsync(It.IsAny<UserOnboarding>())).ReturnsAsync(created);
        _emotionMock
            .Setup(s => s.RegisterEmotionAsync(It.IsAny<EmotionRequest>(), userId))
            .ReturnsAsync(new EmotionResponse { Id = Guid.NewGuid(), UserId = userId, Mood = "Bom" });

        var result = await _controller.Create(request);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.NotNull(createdResult.Value);
    }

    [Fact]
    public async Task Create_NullRequest_ReturnsBadRequest()
    {
        var result = await _controller.Create(null!);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetByUserId_ExistingRecord_ReturnsOk()
    {
        var userId = Guid.NewGuid();
        _onboardingMock
            .Setup(s => s.GetByUserIdAsync(userId))
            .ReturnsAsync(CreateOnboarding(userId));

        var result = await _controller.GetByUserId(userId);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task GetByUserId_NotFound_ReturnsNotFound()
    {
        var userId = Guid.NewGuid();
        _onboardingMock.Setup(s => s.GetByUserIdAsync(userId)).ReturnsAsync((UserOnboarding?)null);

        var result = await _controller.GetByUserId(userId);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Update_ValidRequest_ReturnsOk()
    {
        var userId = Guid.NewGuid();
        var request = CreateRequest(userId, completed: true);
        var existing = CreateOnboarding(userId);

        _onboardingMock.Setup(s => s.GetByUserIdAsync(userId)).ReturnsAsync(existing);
        _onboardingMock.Setup(s => s.UpdateAsync(It.IsAny<UserOnboarding>())).ReturnsAsync(existing);

        var result = await _controller.Update(userId, request);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task Update_UserIdMismatch_ReturnsBadRequest()
    {
        var request = CreateRequest(Guid.NewGuid());

        var result = await _controller.Update(Guid.NewGuid(), request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_NotFound_ReturnsNotFound()
    {
        var userId = Guid.NewGuid();
        var request = CreateRequest(userId);

        _onboardingMock.Setup(s => s.GetByUserIdAsync(userId)).ReturnsAsync((UserOnboarding?)null);

        var result = await _controller.Update(userId, request);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    private static UserOnboardingRequestDto CreateRequest(Guid userId, bool completed = false) => new()
    {
        UserId = userId,
        Goal = "Melhorar bem-estar",
        InitialStatus = EmotionsEnum.Bom,
        Usage = UsageFrequencyEnum.Daily,
        CurrentStatus = "Bom",
        Completed = completed
    };

    private static UserOnboarding CreateOnboarding(Guid userId) => new()
    {
        UserId = userId,
        Goal = "Melhorar bem-estar",
        InitialStatus = EmotionsEnum.Bom,
        Usage = UsageFrequencyEnum.Daily,
        CurrentStatus = "Bom",
        Completed = false
    };
}
