using System.Net.Http.Json;
using System.Text.Json;
using backend.Entities;
using backend.Infrastructure.Exceptions;
using backend.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;

namespace backend.Infrastructure.AIProviders;

// Gemini implementation of the generic AI provider contract.
// The provider-specific payload is isolated here so new vendors can follow the same pattern.
public sealed class GeminiProvider : IAIProvider
{
    private readonly HttpClient _httpClient;
    private readonly GeminiProviderOptions _options;
    private readonly ILogger<GeminiProvider> _logger;

    public GeminiProvider(HttpClient httpClient, IOptions<AIOptions> options, ILogger<GeminiProvider> logger)
    {
        _httpClient = httpClient;
        _options = options.Value.Gemini;
        _logger = logger;
    }

    public string ProviderKey => "gemini";

    public async Task<string> SendMessageAsync(
        string userMessage,
        string systemPrompt,
        List<ChatMessage>? history = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException("Gemini ApiKey is not configured.");
        }

        var requestPayload = new GeminiGenerateContentRequest
        {
            SystemInstruction = string.IsNullOrWhiteSpace(systemPrompt)
                ? null
                : new GeminiSystemInstruction
                {
                    Parts = [new GeminiPart { Text = systemPrompt.Trim() }]
                },
            Contents = BuildContents(userMessage, history),
            GenerationConfig = new GeminiGenerationConfig
            {
                Temperature = _options.Temperature,
                MaxOutputTokens = _options.MaxOutputTokens
            }
        };

        var requestUri = $"models/{_options.Model}:generateContent?key={Uri.EscapeDataString(_options.ApiKey)}";
        using var response = await _httpClient.PostAsJsonAsync(requestUri, requestPayload, JsonOptions, cancellationToken);
        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new AIProviderException($"Gemini request failed with status {(int)response.StatusCode}: {responseBody}");
        }

        var parsed = JsonSerializer.Deserialize<GeminiGenerateContentResponse>(responseBody, JsonOptions)
            ?? throw new AIProviderException("Gemini response could not be parsed.");

        var candidate = parsed.Candidates?.FirstOrDefault();
        var content = candidate?.Content?.Parts?.Where(part => !string.IsNullOrWhiteSpace(part.Text)).Select(part => part.Text).FirstOrDefault();
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new AIProviderException("Gemini response did not contain content.");
        }

        _logger.LogInformation("Gemini model {Model} returned a response", _options.Model);

        return content.Trim();
    }

    private static List<GeminiContent> BuildContents(string userMessage, IEnumerable<ChatMessage>? history)
    {
        var contents = new List<GeminiContent>();

        if (history != null)
        {
            foreach (var item in history.Where(message => !string.IsNullOrWhiteSpace(message.Role) && !string.IsNullOrWhiteSpace(message.Content)))
            {
                if (string.Equals(item.Role, "system", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                contents.Add(new GeminiContent
                {
                    Role = MapRole(item.Role),
                    Parts = [new GeminiPart { Text = item.Content.Trim() }]
                });
            }
        }

        contents.Add(new GeminiContent
        {
            Role = "user",
            Parts = [new GeminiPart { Text = userMessage.Trim() }]
        });

        return contents;
    }

    private static string MapRole(string role)
    {
        return role.ToLowerInvariant() switch
        {
            "assistant" => "model",
            "model" => "model",
            _ => "user"
        };
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    private sealed class GeminiGenerateContentRequest
    {
        public GeminiSystemInstruction? SystemInstruction { get; set; }

        public List<GeminiContent> Contents { get; set; } = [];

        public GeminiGenerationConfig GenerationConfig { get; set; } = new();
    }

    private sealed class GeminiSystemInstruction
    {
        public List<GeminiPart> Parts { get; set; } = [];
    }

    private sealed class GeminiGenerationConfig
    {
        public double Temperature { get; set; }

        public int MaxOutputTokens { get; set; }
    }

    private sealed class GeminiContent
    {
        public string Role { get; set; } = string.Empty;

        public List<GeminiPart> Parts { get; set; } = [];
    }

    private sealed class GeminiPart
    {
        public string Text { get; set; } = string.Empty;
    }

    private sealed class GeminiGenerateContentResponse
    {
        public List<GeminiCandidate>? Candidates { get; set; }
    }

    private sealed class GeminiCandidate
    {
        public GeminiContent? Content { get; set; }
    }
}
