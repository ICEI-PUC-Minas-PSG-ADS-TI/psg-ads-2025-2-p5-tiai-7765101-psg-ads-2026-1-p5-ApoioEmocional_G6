using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Entities;
using backend.Infrastructure.Exceptions;
using backend.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;

namespace backend.Infrastructure.AIProviders;

// OpenAI implementation of the generic AI provider contract.
// Only OpenAI-specific payloads and parsing live here.
public sealed class OpenAIProvider : IAIProvider
{
    private readonly HttpClient _httpClient;
    private readonly OpenAIProviderOptions _options;
    private readonly ILogger<OpenAIProvider> _logger;

    public OpenAIProvider(HttpClient httpClient, IOptions<AIOptions> options, ILogger<OpenAIProvider> logger)
    {
        _httpClient = httpClient;
        _options = options.Value.OpenAI;
        _logger = logger;
    }

    public string ProviderKey => "openai";

    public async Task<string> SendMessageAsync(
        string userMessage,
        string systemPrompt,
        List<ChatMessage>? history = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException("OpenAI ApiKey is not configured.");
        }

        var requestPayload = new OpenAIChatRequest
        {
            Model = _options.Model,
            Temperature = _options.Temperature,
            Messages = BuildMessages(userMessage, systemPrompt, history)
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "chat/completions")
        {
            Content = JsonContent.Create(requestPayload, options: JsonOptions)
        };

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        _logger.LogInformation("Calling OpenAI model {Model}", _options.Model);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new AIProviderException($"OpenAI request failed with status {(int)response.StatusCode}: {responseBody}");
        }

        var parsed = JsonSerializer.Deserialize<OpenAIChatResponse>(responseBody, JsonOptions)
            ?? throw new AIProviderException("OpenAI response could not be parsed.");

        var content = parsed.Choices?.FirstOrDefault()?.Message?.Content;
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new AIProviderException("OpenAI response did not contain content.");
        }

        return content.Trim();
    }

    private static List<OpenAIMessage> BuildMessages(string userMessage, string systemPrompt, IEnumerable<ChatMessage>? history)
    {
        var messages = new List<OpenAIMessage>();

        if (!string.IsNullOrWhiteSpace(systemPrompt))
        {
            messages.Add(new OpenAIMessage { Role = "system", Content = systemPrompt.Trim() });
        }

        if (history != null)
        {
            foreach (var item in history.Where(message => !string.IsNullOrWhiteSpace(message.Role) && !string.IsNullOrWhiteSpace(message.Content)))
            {
                if (string.Equals(item.Role, "system", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                messages.Add(new OpenAIMessage
                {
                    Role = MapRole(item.Role),
                    Content = item.Content.Trim()
                });
            }
        }

        messages.Add(new OpenAIMessage
        {
            Role = "user",
            Content = userMessage.Trim()
        });

        return messages;
    }

    private static string MapRole(string role)
    {
        return role.ToLowerInvariant() switch
        {
            "assistant" => "assistant",
            "model" => "assistant",
            _ => "user"
        };
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    private sealed class OpenAIChatRequest
    {
        public string Model { get; set; } = string.Empty;

        public double Temperature { get; set; }

        public List<OpenAIMessage> Messages { get; set; } = [];
    }

    private sealed class OpenAIMessage
    {
        public string Role { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;
    }

    private sealed class OpenAIChatResponse
    {
        public List<OpenAIChoice>? Choices { get; set; }
    }

    private sealed class OpenAIChoice
    {
        public OpenAIMessage? Message { get; set; }
    }
}
