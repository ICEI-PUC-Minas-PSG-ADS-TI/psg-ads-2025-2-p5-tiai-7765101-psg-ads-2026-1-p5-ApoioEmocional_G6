using backend.Entities;
using backend.Enum;
using backend.Repositories;
using backend.Tests.Helpers;

namespace backend.Tests.Repositories;

public class UserOnboardingRepositoryTests : IDisposable
{
    private readonly Data.AppDbContext _context;
    private readonly UserOnboardingRepository _repository;

    public UserOnboardingRepositoryTests()
    {
        _context = DbContextFactory.Create();
        _repository = new UserOnboardingRepository(_context);
    }

    public void Dispose() => _context.Dispose();

    [Fact]
    public async Task AddAsync_PersistsOnboarding()
    {
        var onboarding = CreateOnboarding();

        var result = await _repository.AddAsync(onboarding);

        Assert.Equal(onboarding.Id, result.Id);
        Assert.Single(_context.UserOnboardings);
    }

    [Fact]
    public async Task GetByUserIdAsync_ReturnsMatchingRecord()
    {
        var userId = Guid.NewGuid();
        var onboarding = CreateOnboarding(userId);
        await _repository.AddAsync(onboarding);

        var result = await _repository.GetByUserIdAsync(userId);

        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
    }

    [Fact]
    public async Task GetByUserIdAsync_NotFound_ReturnsNull()
    {
        var result = await _repository.GetByUserIdAsync(Guid.NewGuid());

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ModifiesPersistedRecord()
    {
        var onboarding = CreateOnboarding();
        await _repository.AddAsync(onboarding);

        onboarding.Completed = true;
        onboarding.Goal = "Novo objetivo";

        var result = await _repository.UpdateAsync(onboarding);
        var fetched = await _repository.GetByUserIdAsync(onboarding.UserId);

        Assert.True(result.Completed);
        Assert.NotNull(fetched);
        Assert.Equal("Novo objetivo", fetched.Goal);
        Assert.True(fetched.Completed);
    }

    private static UserOnboarding CreateOnboarding(Guid? userId = null) => new()
    {
        UserId = userId ?? Guid.NewGuid(),
        Goal = "Melhorar bem-estar",
        InitialStatus = EmotionsEnum.Bom,
        Usage = UsageFrequencyEnum.Daily,
        CurrentStatus = "Bom",
        Completed = false
    };
}
