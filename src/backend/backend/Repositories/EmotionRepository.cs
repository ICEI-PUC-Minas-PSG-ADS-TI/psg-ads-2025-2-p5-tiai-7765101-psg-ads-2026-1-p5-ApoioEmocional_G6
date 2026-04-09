using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class EmotionRepository : IEmotionRepository
    {
        private readonly AppDbContext _context;

        public EmotionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<EmotionLog> AddAsync(EmotionLog log)
        {
            _context.Emotions.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<IEnumerable<EmotionLog>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Emotions
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<EmotionLog>> GetTodayAsync(Guid userId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);
            return await _context.Emotions
                .Where(e => e.UserId == userId && e.CreatedAt >= today && e.CreatedAt < tomorrow)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<EmotionLog>> GetThisWeekAsync(Guid userId)
        {
            var today = DateTime.UtcNow.Date;
            // ISO 8601 week start: Monday
            int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            var weekStart = today.AddDays(-1 * diff);
            var weekEnd = weekStart.AddDays(7);

            return await _context.Emotions
                .Where(e => e.UserId == userId && e.CreatedAt >= weekStart && e.CreatedAt < weekEnd)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<EmotionLog?> GetLatestAsync(Guid userId)
        {
            return await _context.Emotions
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.CreatedAt)
                .FirstOrDefaultAsync();
        }
    }
}
