using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BreathingRepository : IBreathingRepository
    {
        private readonly AppDbContext _context;

        public BreathingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(BreathingLog log)
        {
            await _context.BreathingLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<BreathingLog>> GetByUserIdAsync(Guid userId)
        {
            return await _context.BreathingLogs
                .Where(x => x.UserId == userId) 
                .OrderByDescending(x => x.StartTime)
                .ToListAsync();
        }
    }
}