using backend.Entities;
using backend.Enum;
using backend.Repositories;
using backend.Services;
using Moq;

namespace backend.Tests.Services;

public class UserOnboardingServiceTests
{
    private readonly Mock<IUserOnboardingRepository> _repositoryMock = new();
    private readonly UserOnboardingService _service;

    public UserOnboardingServiceTests()
    {
        _service = new UserOnboardingService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_DelegatesToRepository()
    {
        var onboarding = CreateOnboarding();

        _repositoryMock.Setup(r => r.AddAsync(onboarding)).ReturnsAsync(onboarding);

        var result = await _service.CreateAsync(onboarding);

        Assert.Equal(onboarding, result);
        _repositoryMock.Verify(r => r.AddAsync(onboarding), Times.Once);
    }

    [Fact]
    public async Task GetByUserIdAsync_ReturnsEntity()
    {
        var userId = Guid.NewGuid();
        var onboarding = CreateOnboarding(userId);

        _repositoryMock.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(onboarding);

        var result = await _service.GetByUserIdAsync(userId);

        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
    }

    [Fact]
    public async Task GetByUserIdAsync_NotFound_ReturnsNull()
    {
        var userId = Guid.NewGuid();

        _repositoryMock.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync((UserOnboarding?)null);

        var result = await _service.GetByUserIdAsync(userId);

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_DelegatesToRepository()
    {
        var onboarding = CreateOnboarding();
        onboarding.Completed = true;

        _repositoryMock.Setup(r => r.UpdateAsync(onboarding)).ReturnsAsync(onboarding);

        var result = await _service.UpdateAsync(onboarding);

        Assert.True(result.Completed);
        _repositoryMock.Verify(r => r.UpdateAsync(onboarding), Times.Once);
    }

    private static UserOnboarding CreateOnboarding(Guid? userId = null) => new()
    {
        UserId = userId ?? Guid.NewGuid(),
        Goal = "Melhorar bem-estar",
        InitialStatus = EmotionsEnum.Bom,
        Usage = UsageFrequencyEnum.Daily,
        Completed = false
    };
}
