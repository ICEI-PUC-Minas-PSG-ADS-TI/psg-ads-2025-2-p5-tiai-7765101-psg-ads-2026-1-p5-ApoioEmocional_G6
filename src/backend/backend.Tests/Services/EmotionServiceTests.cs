using backend.DTOs;
using backend.Entities;
using backend.Enum;
using backend.Repositories;
using backend.Services;
using Moq;

namespace backend.Tests.Services;

public class EmotionServiceTests
{
    private readonly Mock<IEmotionRepository> _repositoryMock = new();
    private readonly EmotionService _service;

    public EmotionServiceTests()
    {
        _service = new EmotionService(_repositoryMock.Object);
    }

    [Fact]
    public async Task RegisterEmotionAsync_ValidMood_PersistsAndReturnsResponse()
    {
        var userId = Guid.NewGuid();
        var request = new EmotionRequest { Mood = "Bom", Diary = "Dia bom" };

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<EmotionLog>()))
            .ReturnsAsync((EmotionLog log) => log);

        var result = await _service.RegisterEmotionAsync(request, userId);

        Assert.Equal(userId, result.UserId);
        Assert.Equal("Bom", result.Mood);
        Assert.Equal("Dia bom", result.Diary);
        _repositoryMock.Verify(r => r.AddAsync(It.Is<EmotionLog>(l =>
            l.UserId == userId && l.Emotion == EmotionsEnum.Bom)), Times.Once);
    }

    [Fact]
    public async Task RegisterEmotionAsync_InvalidMood_ThrowsArgumentException()
    {
        var request = new EmotionRequest { Mood = "InvalidMood" };

        await Assert.ThrowsAsync<ArgumentException>(() =>
            _service.RegisterEmotionAsync(request, Guid.NewGuid()));
    }

    [Fact]
    public async Task GetAllAsync_MapsRepositoryResults()
    {
        var userId = Guid.NewGuid();
        var logs = new List<EmotionLog>
        {
            new()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Emotion = EmotionsEnum.Otimo,
                CreatedAt = DateTime.UtcNow,
                Diary = "test"
            }
        };

        _repositoryMock.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(logs);

        var result = (await _service.GetAllAsync(userId)).ToList();

        Assert.Single(result);
        Assert.Equal("Otimo", result[0].Mood);
        Assert.Equal("test", result[0].Diary);
    }

    [Fact]
    public async Task GetTodayAsync_MapsRepositoryResults()
    {
        var userId = Guid.NewGuid();
        var logs = new List<EmotionLog>
        {
            new()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Emotion = EmotionsEnum.Triste,
                CreatedAt = DateTime.UtcNow
            }
        };

        _repositoryMock.Setup(r => r.GetTodayAsync(userId)).ReturnsAsync(logs);

        var result = (await _service.GetTodayAsync(userId)).ToList();

        Assert.Single(result);
        Assert.Equal("Triste", result[0].Mood);
    }

    [Fact]
    public async Task GetThisWeekAsync_GroupsByDateAndOrders()
    {
        var userId = Guid.NewGuid();
        var day1 = DateTime.UtcNow.Date;
        var day2 = day1.AddDays(-1);

        var logs = new List<EmotionLog>
        {
            new() { Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Bom, CreatedAt = day1.AddHours(10) },
            new() { Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Otimo, CreatedAt = day1.AddHours(8) },
            new() { Id = Guid.NewGuid(), UserId = userId, Emotion = EmotionsEnum.Okay, CreatedAt = day2.AddHours(12) }
        };

        _repositoryMock.Setup(r => r.GetThisWeekAsync(userId)).ReturnsAsync(logs);

        var result = (await _service.GetThisWeekAsync(userId)).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal(day2, result[0].Date);
        Assert.Equal(day1, result[1].Date);
        Assert.Equal("Otimo", result[1].Emotions.First().Mood);
        Assert.Equal("Bom", result[1].Emotions.Last().Mood);
    }
}
