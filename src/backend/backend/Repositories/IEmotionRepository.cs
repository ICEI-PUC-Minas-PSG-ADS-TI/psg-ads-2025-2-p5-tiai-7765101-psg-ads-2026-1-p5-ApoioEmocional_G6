using backend.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IEmotionRepository
    {
        Task<EmotionLog> AddAsync(EmotionLog log);

        Task<IEnumerable<EmotionLog>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<EmotionLog>> GetTodayAsync(Guid userId);
        Task<IEnumerable<EmotionLog>> GetThisWeekAsync(Guid userId);
        Task<EmotionLog?> GetLatestAsync(Guid userId);
    }
}
