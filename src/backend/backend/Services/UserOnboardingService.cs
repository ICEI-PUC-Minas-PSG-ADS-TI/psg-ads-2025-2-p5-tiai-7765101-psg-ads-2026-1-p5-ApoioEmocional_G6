using backend.Entities;
using backend.Repositories;
using System;
using System.Threading.Tasks;

namespace backend.Services
{
    public class UserOnboardingService : IUserOnboardingService
    {
        private readonly IUserOnboardingRepository _repository;

        public UserOnboardingService(IUserOnboardingRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserOnboarding> CreateAsync(UserOnboarding onboarding)
        {
            // Validações e regras de negócio podem ser adicionadas aqui no futuro
            return await _repository.AddAsync(onboarding);
        }

        public async Task<UserOnboarding?> GetByUserIdAsync(Guid userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<UserOnboarding> UpdateAsync(UserOnboarding onboarding)
        {
            return await _repository.UpdateAsync(onboarding);
        }
    }
}