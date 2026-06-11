namespace backend.Infrastructure.Exceptions;

// Raised when a provider key is not registered in DI.
public sealed class ProviderNotFoundException : Exception
{
    public ProviderNotFoundException(string provider)
        : base($"AI provider '{provider}' is not registered.")
    {
    }
}
