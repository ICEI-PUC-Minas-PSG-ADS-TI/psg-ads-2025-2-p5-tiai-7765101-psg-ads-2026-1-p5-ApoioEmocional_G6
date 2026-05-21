using backend.Entities;
using System;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IUserOnboardingRepository
    {
        Task<UserOnboarding> AddAsync(UserOnboarding onboarding);
        Task<UserOnboarding?> GetByUserIdAsync(Guid userId);
        Task<UserOnboarding> UpdateAsync(UserOnboarding onboarding);
    }
}