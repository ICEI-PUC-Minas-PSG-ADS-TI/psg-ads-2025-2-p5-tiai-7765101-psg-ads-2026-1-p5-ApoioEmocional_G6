namespace backend.Entities;

// Represents a single message exchanged with the assistant.
// Keeping this model generic makes it reusable for history, streaming and future persistence.
public sealed class ChatMessage
{
    public string Role { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;
}
