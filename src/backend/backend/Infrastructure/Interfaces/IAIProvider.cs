using backend.Entities;

namespace backend.Infrastructure.Interfaces;

// Contract implemented by each AI provider.
// The provider key lets the factory resolve providers dynamically without hard-coding the orchestration layer.
public interface IAIProvider
{
    string ProviderKey { get; }

    Task<string> SendMessageAsync(
        string userMessage,
        string systemPrompt,
        List<ChatMessage>? history = null,
        CancellationToken cancellationToken = default);
}
