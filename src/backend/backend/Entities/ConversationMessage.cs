using System;

namespace backend.Entities
{
    public class ConversationMessage
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ConversationId { get; set; }
        public Conversation Conversation { get; set; } = null!;

        public string Role { get; set; } = string.Empty; // "user" or "assistant"

        public string Content { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
