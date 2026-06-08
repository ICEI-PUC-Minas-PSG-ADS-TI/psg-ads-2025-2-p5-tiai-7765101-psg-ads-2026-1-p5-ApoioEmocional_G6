using backend.Entities;
using backend.Enum;
using backend.Repositories;
using backend.Tests.Helpers;

namespace backend.Tests.Repositories;

public class BreathingRepositoryTests : IDisposable
{
    private readonly Data.AppDbContext _context;
    private readonly BreathingRepository _repository;

    public BreathingRepositoryTests()
    {
        _context = DbContextFactory.Create();
        _repository = new BreathingRepository(_context);
    }

    public void Dispose() => _context.Dispose();

    [Fact]
    public async Task AddAsync_PersistsBreathingLog()
    {
        var log = new BreathingLog
        {
            UserId = Guid.NewGuid(),
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow.AddMinutes(5),
            BreathingType = BreathingTypeEnum.Quadrada
        };

        await _repository.AddAsync(log);

        Assert.Single(_context.BreathingLogs);
    }

    [Fact]
    public async Task GetByUserIdAsync_FiltersAndOrdersByStartTimeDescending()
    {
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        await _repository.AddAsync(new BreathingLog
        {
            UserId = userId,
            StartTime = new DateTime(2026, 6, 5, 10, 0, 0),
            EndTime = new DateTime(2026, 6, 5, 10, 5, 0),
            BreathingType = BreathingTypeEnum.Quadrada
        });
        await _repository.AddAsync(new BreathingLog
        {
            UserId = userId,
            StartTime = new DateTime(2026, 6, 7, 10, 0, 0),
            EndTime = new DateTime(2026, 6, 7, 10, 5, 0),
            BreathingType = BreathingTypeEnum.Tecnica478
        });
        await _repository.AddAsync(new BreathingLog
        {
            UserId = otherUserId,
            StartTime = new DateTime(2026, 6, 7, 12, 0, 0),
            EndTime = new DateTime(2026, 6, 7, 12, 5, 0),
            BreathingType = BreathingTypeEnum.Ancoragem
        });

        var result = (await _repository.GetByUserIdAsync(userId)).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal(BreathingTypeEnum.Tecnica478, result[0].BreathingType);
        Assert.All(result, l => Assert.Equal(userId, l.UserId));
    }
}
