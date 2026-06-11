using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public class Conversation
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Date only (UTC date) representing the day of the conversation
        public DateTime Date { get; set; }

        public Guid UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ConversationMessage> Messages { get; set; } = new List<ConversationMessage>();
    }
}
