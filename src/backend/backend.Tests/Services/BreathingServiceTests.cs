using backend.DTOs;
using backend.Entities;
using backend.Enum;
using backend.Repositories;
using backend.Services;
using Moq;

namespace backend.Tests.Services;

public class BreathingServiceTests
{
    private readonly Mock<IBreathingRepository> _repositoryMock = new();
    private readonly BreathingService _service;

    public BreathingServiceTests()
    {
        _service = new BreathingService(_repositoryMock.Object);
    }

    [Fact]
    public async Task SaveSessionAsync_ValidRequest_CallsRepositoryWithConvertedTimes()
    {
        var userId = Guid.NewGuid().ToString();
        var startUtc = new DateTime(2026, 6, 7, 15, 0, 0, DateTimeKind.Utc);
        var endUtc = new DateTime(2026, 6, 7, 15, 5, 0, DateTimeKind.Utc);
        var request = new BreathingRequest
        {
            StartTime = startUtc,
            EndTime = endUtc,
            BreathingType = (int)BreathingTypeEnum.Quadrada
        };

        BreathingLog? captured = null;
        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<BreathingLog>()))
            .Callback<BreathingLog>(l => captured = l)
            .Returns(Task.CompletedTask);

        await _service.SaveSessionAsync(userId, request);

        Assert.NotNull(captured);
        Assert.Equal(Guid.Parse(userId), captured.UserId);
        Assert.Equal(BreathingTypeEnum.Quadrada, captured.BreathingType);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<BreathingLog>()), Times.Once);
    }

    [Fact]
    public async Task SaveSessionAsync_InvalidUserId_ThrowsFormatException()
    {
        var request = new BreathingRequest
        {
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddMinutes(5),
            BreathingType = 1
        };

        await Assert.ThrowsAsync<FormatException>(() =>
            _service.SaveSessionAsync("not-a-guid", request));
    }
}
