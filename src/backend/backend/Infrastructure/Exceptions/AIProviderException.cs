namespace backend.Infrastructure.Exceptions;

// Represents a failure while communicating with an external AI provider.
// The middleware maps this to a clean 502 response for API consumers.
public sealed class AIProviderException : Exception
{
    public AIProviderException(string message)
        : base(message)
    {
    }

    public AIProviderException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
