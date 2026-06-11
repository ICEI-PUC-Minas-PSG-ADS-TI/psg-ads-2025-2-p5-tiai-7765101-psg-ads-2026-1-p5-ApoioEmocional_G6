using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

// Centralized AI configuration.
// Keeping provider settings here avoids leaking vendor-specific details into application services.
public sealed class AIOptions
{
    [Required]
    public string DefaultProvider { get; set; } = "gemini";

    [Required]
    public string DefaultPrompt { get; set; } = "emotional-support";

    [Range(1, 10)]
    public int RetryCount { get; set; } = 3;

    [Range(5, 300)]
    public int TimeoutSeconds { get; set; } = 60;

    public OpenAIProviderOptions OpenAI { get; set; } = new();

    public GeminiProviderOptions Gemini { get; set; } = new();
}

public sealed class OpenAIProviderOptions
{
    [Required]
    public string ApiKey { get; set; } = string.Empty;

    [Required]
    public string BaseUrl { get; set; } = "https://api.openai.com/v1/";

    [Required]
    public string Model { get; set; } = "gpt-4o-mini";

    [Range(0, 2)]
    public double Temperature { get; set; } = 0.7;
}

public sealed class GeminiProviderOptions
{
    [Required]
    public string ApiKey { get; set; } = string.Empty;

    [Required]
    public string BaseUrl { get; set; } = "https://generativelanguage.googleapis.com/v1beta/";

    [Required]
    public string Model { get; set; } = "gemini-1.5-flash";

    [Range(0, 2)]
    public double Temperature { get; set; } = 0.7;

    [Range(1, 8192)]
    public int MaxOutputTokens { get; set; } = 1024;
}
