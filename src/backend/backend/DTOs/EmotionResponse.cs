using System;
using backend.Enum;

namespace backend.DTOs
{
    public class EmotionResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Mood { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
