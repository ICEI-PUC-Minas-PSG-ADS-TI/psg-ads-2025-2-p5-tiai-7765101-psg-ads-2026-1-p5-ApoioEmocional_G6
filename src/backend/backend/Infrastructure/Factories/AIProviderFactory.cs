using backend.Infrastructure.Exceptions;
using backend.Infrastructure.Interfaces;

namespace backend.Infrastructure.Factories;

// Resolves a provider dynamically from the DI container.
// Adding a new provider only requires a new implementation and a new DI registration.
public sealed class AIProviderFactory : IAIProviderFactory
{
    private readonly IReadOnlyDictionary<string, IAIProvider> _providers;

    public AIProviderFactory(IEnumerable<IAIProvider> providers)
    {
        _providers = providers.ToDictionary(provider => provider.ProviderKey, StringComparer.OrdinalIgnoreCase);
    }

    public IAIProvider Create(string provider)
    {
        if (string.IsNullOrWhiteSpace(provider))
        {
            throw new ProviderNotFoundException(provider);
        }

        if (_providers.TryGetValue(provider.Trim(), out var resolvedProvider))
        {
            return resolvedProvider;
        }

        throw new ProviderNotFoundException(provider);
    }
}
