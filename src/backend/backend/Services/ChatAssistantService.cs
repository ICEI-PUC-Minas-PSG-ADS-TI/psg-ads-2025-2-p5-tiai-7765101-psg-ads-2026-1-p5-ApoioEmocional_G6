using backend.DTOs;
using backend.Entities;
using backend.Infrastructure.Interfaces;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.IO;
using System.Linq;
using System.Security.Claims;

namespace backend.Services; 

// Application service that composes prompts, resolves the provider and normalizes the response.
// Future fallback, persistence and sentiment routing can be added here without changing controllers.
public sealed class ChatAssistantService : IChatAssistantService
{
    private readonly IAIProviderFactory _providerFactory;
    private readonly AIOptions _aiOptions;
    private readonly ILogger<ChatAssistantService> _logger;
    private readonly IPromptService _promptService;
    private readonly IConversationRepository _conversationRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ChatAssistantService(
        IAIProviderFactory providerFactory,
        IOptions<AIOptions> aiOptions,
        ILogger<ChatAssistantService> logger,
        IPromptService promptService,
        IConversationRepository conversationRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _providerFactory = providerFactory;
        _aiOptions = aiOptions.Value;
        _logger = logger;
        _promptService = promptService;
        _conversationRepository = conversationRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ChatHistoryResponse> GetMessagesAsync(Guid userId)
    {
        var conversation = await _conversationRepository.GetTodayConversationAsync(userId);

        if (conversation == null)
        {
            return new ChatHistoryResponse();
        }

        var messages = await _conversationRepository.GetMessagesForConversationAsync(conversation.Id);

        return new ChatHistoryResponse
        {
            Messages = messages.Select(m => new ChatHistoryMessageDto
            {
                Id = m.Id,
                Role = m.Role,
                Content = m.Content,
                Timestamp = m.Timestamp
            }).ToList()
        };
    }

    public async Task<ChatResponse> SendAsync(ChatRequest request, Guid userId, CancellationToken cancellationToken = default)
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

        // Business rule: one conversation per user per day (UTC)
        var today = DateTime.UtcNow.Date;

        var conversation = await _conversationRepository.GetTodayConversationAsync(userId);

        if (conversation == null)
        {
            conversation = await _conversationRepository.CreateConversationAsync(userId, today);
        }

        // Save user message
        var userMessage = new ConversationMessage
        {
            ConversationId = conversation.Id,
            Role = "user",
            Content = request.Message,
            Timestamp = DateTime.UtcNow
        };

        await _conversationRepository.AddMessageAsync(userMessage);

        // Build full history from DB
        var history = await _conversationRepository.GetMessagesForConversationAsync(conversation.Id);

        var historyForProvider = history.Select(m => new ChatMessage { Role = m.Role, Content = m.Content }).ToList();

        // Append the new message to the history passed to provider
        historyForProvider.Add(new ChatMessage { Role = userMessage.Role, Content = userMessage.Content });

        // Call provider with full history
        var providerResponse = await provider.SendMessageAsync(
            request.Message,
            systemPrompt,
            historyForProvider,
            cancellationToken);

        // Save assistant response
        var assistantMessage = new ConversationMessage
        {
            ConversationId = conversation.Id,
            Role = "assistant",
            Content = providerResponse,
            Timestamp = DateTime.UtcNow
        };

        await _conversationRepository.AddMessageAsync(assistantMessage);

        return new ChatResponse
        {
            Response = providerResponse
        };
    }
}
