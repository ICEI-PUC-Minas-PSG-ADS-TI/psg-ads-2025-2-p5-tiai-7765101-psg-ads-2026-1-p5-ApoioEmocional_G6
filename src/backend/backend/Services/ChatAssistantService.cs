using backend.DTOs;
using backend.Entities;
using backend.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;
using System.IO;

namespace backend.Services; 

// Application service that composes prompts, resolves the provider and normalizes the response.
// Future fallback, persistence and sentiment routing can be added here without changing controllers.
public sealed class ChatAssistantService : IChatAssistantService
{
    private readonly IAIProviderFactory _providerFactory;
    private readonly AIOptions _aiOptions;
    private readonly ILogger<ChatAssistantService> _logger;
    private readonly IPromptService _promptService;

    public ChatAssistantService(
        IAIProviderFactory providerFactory,
        IOptions<AIOptions> aiOptions,
        ILogger<ChatAssistantService> logger,
        IPromptService promptService)
    {
        _providerFactory = providerFactory;
        _aiOptions = aiOptions.Value;
        _logger = logger;
        _promptService = promptService;
    }

    public async Task<ChatResponse> SendAsync(ChatRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var providerName = string.IsNullOrWhiteSpace(request.Provider)
            ? _aiOptions.DefaultProvider
            : request.Provider;

        var provider = _providerFactory.Create(providerName);

        var promptName = _aiOptions.DefaultPrompt;

        string systemPrompt;
        try
        {
            systemPrompt = _promptService.GetPrompt(promptName);
        }
        catch (FileNotFoundException ex)
        {
            _logger.LogError(ex, "Prompt '{PromptName}' não encontrado.", promptName);
            throw;
        }

        _logger.LogInformation("Sending message through provider {Provider}", provider.ProviderKey);

        var providerResponse = await provider.SendMessageAsync(
            request.Message,
            systemPrompt,
            request.History,
            cancellationToken);

        return new ChatResponse
        {
            Response = providerResponse
        };
    }
}
