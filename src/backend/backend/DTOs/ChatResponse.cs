namespace backend.DTOs;

// Response contract returned by the chat endpoint.
public sealed class ChatResponse
{
    public string Response { get; set; } = string.Empty;
}
