using backend.Entities;
using System;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IUserOnboardingService
    {
        Task<UserOnboarding> CreateAsync(UserOnboarding onboarding);
        Task<UserOnboarding?> GetByUserIdAsync(Guid userId);
        Task<UserOnboarding> UpdateAsync(UserOnboarding onboarding);
    }
}