using backend.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Infrastructure
{
    public static class RepositoriesExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IConversationRepository, ConversationRepository>();
            return services;
        }
    }
}
