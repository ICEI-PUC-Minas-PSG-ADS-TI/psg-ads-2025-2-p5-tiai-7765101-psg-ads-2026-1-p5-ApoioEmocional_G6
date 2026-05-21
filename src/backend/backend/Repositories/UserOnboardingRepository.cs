using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class UserOnboardingRepository : IUserOnboardingRepository
    {
        private readonly AppDbContext _context;

        public UserOnboardingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserOnboarding> AddAsync(UserOnboarding onboarding)
        {
            _context.UserOnboardings.Add(onboarding);
            await _context.SaveChangesAsync();
            return onboarding;
        }

        public async Task<UserOnboarding?> GetByUserIdAsync(Guid userId)
        {
            return await _context.UserOnboardings
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<UserOnboarding> UpdateAsync(UserOnboarding onboarding)
        {
            _context.UserOnboardings.Update(onboarding);
            await _context.SaveChangesAsync();
            return onboarding;
        }
    }
}

