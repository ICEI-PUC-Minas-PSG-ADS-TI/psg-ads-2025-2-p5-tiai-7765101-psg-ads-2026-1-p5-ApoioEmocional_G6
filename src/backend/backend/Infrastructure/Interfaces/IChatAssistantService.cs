using backend.DTOs;

namespace backend.Infrastructure.Interfaces;

// Orchestrates user input, provider selection and prompt assembly.
public interface IChatAssistantService
{
    Task<ChatHistoryResponse> GetMessagesAsync(Guid userId);
    Task<ChatResponse> SendAsync(ChatRequest request, Guid userId, CancellationToken cancellationToken = default);
}
