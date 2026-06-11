using backend.DTOs;

namespace backend.Infrastructure.Interfaces;

// Orchestrates user input, provider selection and prompt assembly.
public interface IChatAssistantService
{
    Task<ChatResponse> SendAsync(ChatRequest request, CancellationToken cancellationToken = default);
}
