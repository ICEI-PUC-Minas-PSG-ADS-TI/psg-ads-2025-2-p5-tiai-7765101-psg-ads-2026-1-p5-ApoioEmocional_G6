using Microsoft.AspNetCore.Hosting;
using System.Collections.Concurrent;
using System.IO;

namespace backend.Services;

public class PromptService : IPromptService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ConcurrentDictionary<string, string> _cache = new();
    private static readonly string[] _supportedExtensions = new[] { ".txt", ".md" };

    public PromptService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public string GetPrompt(string promptName)
    {
        if (string.IsNullOrWhiteSpace(promptName))
            throw new ArgumentException("Nome do prompt não pode ser vazio.", nameof(promptName));

        // Try cache first
        if (_cache.TryGetValue(promptName, out var cached))
            return cached;

        foreach (var ext in _supportedExtensions)
        {
            var path = Path.Combine(_environment.ContentRootPath, "Prompts", promptName + ext);
            if (File.Exists(path))
            {
                var content = File.ReadAllText(path);
                _cache[promptName] = content;
                return content;
            }
        }

        throw new FileNotFoundException($"Prompt '{promptName}' não encontrado.");
    }
}
