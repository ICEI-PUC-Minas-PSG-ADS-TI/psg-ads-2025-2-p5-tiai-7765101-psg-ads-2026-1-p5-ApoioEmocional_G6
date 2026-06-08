using backend.Entities;
using backend.Repositories;

namespace backend.Services
{
    public class UserOnboardingService : IUserOnboardingService
    {
        private readonly IUserOnboardingRepository _repository;

        public UserOnboardingService(IUserOnboardingRepository repository)
        {
            _repository = repository;
        }

        public Task<UserOnboarding> CreateAsync(UserOnboarding onboarding)
        {
            return _repository.AddAsync(onboarding);
        }

        public Task<UserOnboarding?> GetByUserIdAsync(Guid userId)
        {
            return _repository.GetByUserIdAsync(userId);
        }

        public Task<UserOnboarding> UpdateAsync(UserOnboarding onboarding)
        {
            return _repository.UpdateAsync(onboarding);
        }
    }
}
