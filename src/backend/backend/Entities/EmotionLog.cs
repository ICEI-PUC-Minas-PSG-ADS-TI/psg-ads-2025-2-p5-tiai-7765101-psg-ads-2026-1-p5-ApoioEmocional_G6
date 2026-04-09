using backend.Enum;
namespace backend.Entities
{
    public class EmotionLog
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public EmotionsEnum Emotion { get; set; } 
        public DateTime CreatedAt { get; set; }
    }
}
