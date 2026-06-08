using backend.Entities;
using backend.Enum;
using backend.Repositories;
using backend.Tests.Helpers;

namespace backend.Tests.Repositories;

public class EmotionRepositoryTests : IDisposable
{
    private readonly Data.AppDbContext _context;
    private readonly EmotionRepository _repository;

    public EmotionRepositoryTests()
    {
        _context = DbContextFactory.Create();
        _repository = new EmotionRepository(_context);
    }

    public void Dispose() => _context.Dispose();

    [Fact]
    public async Task AddAsync_PersistsEmotionLog()
    {
        var log = new EmotionLog
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Emotion = EmotionsEnum.Bom,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _repository.AddAsync(log);

        Assert.Equal(log.Id, result.Id);
        Assert.Single(_context.Emotions);
    }

    [Fact]
    public async Task GetByUserIdAsync_FiltersAndOrdersDescending()
    {
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Bom,
            CreatedAt = DateTime.UtcNow.AddHours(-2)
        });
        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Otimo,
            CreatedAt = DateTime.UtcNow
        });
        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = otherUserId, Emotion = EmotionsEnum.Triste,
            CreatedAt = DateTime.UtcNow
        });

        var result = (await _repository.GetByUserIdAsync(userId)).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal(EmotionsEnum.Otimo, result[0].Emotion);
        Assert.All(result, e => Assert.Equal(userId, e.UserId));
    }

    [Fact]
    public async Task GetTodayAsync_ReturnsOnlyTodayRecords()
    {
        var userId = Guid.NewGuid();
        var today = DateTime.UtcNow;

        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Bom,
            CreatedAt = today
        });
        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Triste,
            CreatedAt = today.AddDays(-1)
        });

        var result = (await _repository.GetTodayAsync(userId)).ToList();

        Assert.Single(result);
        Assert.Equal(EmotionsEnum.Bom, result[0].Emotion);
    }

    [Fact]
    public async Task GetThisWeekAsync_ReturnsRecordsWithinIsoWeek()
    {
        var userId = Guid.NewGuid();
        var today = DateTime.UtcNow.Date;
        int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
        var weekStart = today.AddDays(-diff);

        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Bom,
            CreatedAt = weekStart.AddHours(1)
        });
        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Triste,
            CreatedAt = weekStart.AddDays(-1)
        });

        var result = (await _repository.GetThisWeekAsync(userId)).ToList();

        Assert.Single(result);
        Assert.Equal(EmotionsEnum.Bom, result[0].Emotion);
    }

    [Fact]
    public async Task GetLatestAsync_ReturnsMostRecent()
    {
        var userId = Guid.NewGuid();

        await _repository.AddAsync(new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Bom,
            CreatedAt = DateTime.UtcNow.AddHours(-3)
        });
        var latest = new EmotionLog
        {
            Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Otimo,
            CreatedAt = DateTime.UtcNow
        };
        await _repository.AddAsync(latest);

        var result = await _repository.GetLatestAsync(userId);

        Assert.NotNull(result);
        Assert.Equal(latest.Id, result.Id);
    }

    [Fact]
    public async Task GetLatestAsync_NoRecords_ReturnsNull()
    {
        var result = await _repository.GetLatestAsync(Guid.NewGuid());

        Assert.Null(result);
    }
}
