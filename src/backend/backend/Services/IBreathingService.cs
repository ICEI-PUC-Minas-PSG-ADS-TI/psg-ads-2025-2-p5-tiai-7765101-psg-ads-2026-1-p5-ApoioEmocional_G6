using backend.DTOs;

namespace backend.Services
{
    public interface IBreathingService
    {
        Task SaveSessionAsync(string userId, BreathingRequest request);
    }
}