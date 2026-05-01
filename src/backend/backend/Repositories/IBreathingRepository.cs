using backend.Entities;

namespace backend.Repositories
{
    public interface IBreathingRepository
    {
        Task AddAsync(BreathingLog log);
        Task<IEnumerable<BreathingLog>> GetByUserIdAsync(Guid userId);
    }
}