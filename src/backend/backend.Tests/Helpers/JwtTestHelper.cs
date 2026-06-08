using Microsoft.Extensions.Configuration;

namespace backend.Tests.Helpers;

public static class JwtTestHelper
{
    public static IConfiguration CreateConfiguration()
    {
        var settings = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "TestSecretKeyWithAtLeast32Characters!!",
            ["Jwt:Issuer"] = "TestIssuer",
            ["Jwt:Audience"] = "TestAudience"
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();
    }
}
