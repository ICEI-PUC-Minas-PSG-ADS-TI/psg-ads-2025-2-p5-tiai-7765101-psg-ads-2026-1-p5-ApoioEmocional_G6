using backend.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IEmotionService
    {
        Task<EmotionResponse> RegisterEmotionAsync(EmotionRequest request, Guid userId);
        Task<IEnumerable<EmotionResponse>> GetAllAsync(Guid userId);
        Task<IEnumerable<EmotionResponse>> GetTodayAsync(Guid userId);
        Task<IEnumerable<EmotionResponse>> GetThisWeekAsync(Guid userId);
    }
}
