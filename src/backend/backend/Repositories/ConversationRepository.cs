using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public interface IConversationRepository
    {
        Task<Conversation?> GetTodayConversationAsync(Guid userId);
        Task<Conversation> CreateConversationAsync(Guid userId, DateTime date);
        Task AddMessageAsync(ConversationMessage message);
        Task<List<ConversationMessage>> GetMessagesForConversationAsync(Guid conversationId);
        Task SaveChangesAsync();
    }

    public class ConversationRepository : IConversationRepository
    {
        private readonly AppDbContext _db;

        public ConversationRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Conversation?> GetTodayConversationAsync(Guid userId)
        {
            var utcToday = DateTime.UtcNow.Date;
            return await _db.Conversations
                .Include(c => c.Messages)
                .Where(c => c.UserId == userId && c.Date == utcToday)
                .FirstOrDefaultAsync();
        }

        public async Task<Conversation> CreateConversationAsync(Guid userId, DateTime date)
        {
            var conv = new Conversation
            {
                UserId = userId,
                Date = date,
                CreatedAt = DateTime.UtcNow
            };

            _db.Conversations.Add(conv);
            await _db.SaveChangesAsync();
            return conv;
        }

        public async Task AddMessageAsync(ConversationMessage message)
        {
            _db.ConversationMessages.Add(message);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ConversationMessage>> GetMessagesForConversationAsync(Guid conversationId)
        {
            return await _db.ConversationMessages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
