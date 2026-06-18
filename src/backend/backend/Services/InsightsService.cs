using backend.Entities;
using backend.Infrastructure.Interfaces;
using backend.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace backend.Services
{
    public sealed class InsightsService : IInsightsService
    {
        private readonly IEmotionRepository _emotionRepository;
        private readonly IAIProviderFactory _providerFactory;
        private readonly IPromptService _promptService;
        private readonly AIOptions _aiOptions;
        private readonly ILogger<InsightsService> _logger;

        public InsightsService(
            IEmotionRepository emotionRepository,
            IAIProviderFactory providerFactory,
            IPromptService promptService,
            IOptions<AIOptions> aiOptions,
            ILogger<InsightsService> logger)
        {
            _emotionRepository = emotionRepository;
            _providerFactory = providerFactory;
            _promptService = promptService;
            _aiOptions = aiOptions.Value;
            _logger = logger;
        }

        public async Task<IEnumerable<string>> GetInsightsAsync(Guid userId)
        {
            var emotionLogs = await _emotionRepository.GetByUserIdAsync(userId);
            var diaryEntries = emotionLogs
                .Where(e => !string.IsNullOrWhiteSpace(e.Diary))
                .OrderByDescending(e => e.CreatedAt)
                .Take(20)
                .ToList();

            if (!diaryEntries.Any())
            {
                return Array.Empty<string>();
            }

            var providerName = _aiOptions.DefaultProvider;
            var provider = _providerFactory.Create(providerName);
            var systemPrompt = _promptService.GetPrompt("insights-summary");
            var userMessage = BuildUserMessage(diaryEntries);

            var providerResponse = await provider.SendMessageAsync(userMessage, systemPrompt, null);
            var insights = ParseInsights(providerResponse);
            return insights.Any() ? insights : new[] { providerResponse.Trim() };
        }

        private static string BuildUserMessage(IEnumerable<EmotionLog> entries)
        {
            var lines = new List<string>
            {
                "A seguir estão os registros recentes de diário do usuário, com humor e reflexão. Use estes textos para gerar até 3 insights curtos em português, cada um em uma frase."
            };

            foreach (var entry in entries.OrderBy(e => e.CreatedAt))
            {
                var date = entry.CreatedAt.ToString("dd/MM/yyyy");
                var mood = string.IsNullOrWhiteSpace(entry.Emotion?.ToString()) ? "Sem humor" : entry.Emotion.ToString();
                var diary = entry.Diary?.Trim().Replace("\r", " ").Replace("\n", " ") ?? string.Empty;
                lines.Add($"Data: {date}; Humor: {mood}; Diário: {diary}");
            }

            lines.Add("Gere os insights com empatia, focando em padrões emocionais, mudanças recentes e recomendações suaves de autocuidado. Evite diagnósticos e conselhos médicos. Responda apenas com frases separadas por linha, sem numeração.");
            return string.Join("\n", lines);
        }

        private static IReadOnlyList<string> ParseInsights(string response)
        {
            var parts = response
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(line => Regex.Replace(line, "^[\-\d\.\)\s]+", string.Empty).Trim())
                .Where(line => !string.IsNullOrWhiteSpace(line))
                .Take(3)
                .ToList();

            return parts;
        }
    }
}
