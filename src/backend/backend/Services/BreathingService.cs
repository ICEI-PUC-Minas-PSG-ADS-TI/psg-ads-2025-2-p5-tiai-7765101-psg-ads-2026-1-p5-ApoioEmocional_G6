using backend.Entities;
using backend.Repositories;
using backend.DTOs;

namespace backend.Services
{
    public class BreathingService : IBreathingService
    {
        private readonly IBreathingRepository _repository;

        public BreathingService(IBreathingRepository repository)
        {
            _repository = repository;
        }

        public async Task SaveSessionAsync(string userId, BreathingRequest request)
        {
            TimeZoneInfo brazilZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

            var log = new BreathingLog
            {
                UserId = Guid.Parse(userId),
                StartTime = TimeZoneInfo.ConvertTimeFromUtc(request.StartTime.ToUniversalTime(), brazilZone),
                EndTime = TimeZoneInfo.ConvertTimeFromUtc(request.EndTime.ToUniversalTime(), brazilZone)
            };

            await _repository.AddAsync(log);
        }
    }
}