namespace backend.Infrastructure.Interfaces;

// Resolves the correct provider at runtime so the chat service stays provider-agnostic.
public interface IAIProviderFactory
{
    IAIProvider Create(string provider);
}
