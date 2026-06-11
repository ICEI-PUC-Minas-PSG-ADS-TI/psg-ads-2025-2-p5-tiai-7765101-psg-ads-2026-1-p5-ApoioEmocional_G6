using System.ComponentModel.DataAnnotations;
using backend.Entities;

namespace backend.DTOs;

// Request contract for the chat endpoint.
// The controller keeps validation thin so providers and orchestration can stay isolated.
public sealed class ChatRequest
{
    [Required]
    public string Provider { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string Message { get; set; } = string.Empty;

    public List<ChatMessage> History { get; set; } = [];
}
