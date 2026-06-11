using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public sealed class ChatHistoryMessageDto
    {
        public Guid Id { get; set; }
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }

    public sealed class ChatHistoryResponse
    {
        public List<ChatHistoryMessageDto> Messages { get; set; } = new List<ChatHistoryMessageDto>();
    }
}
