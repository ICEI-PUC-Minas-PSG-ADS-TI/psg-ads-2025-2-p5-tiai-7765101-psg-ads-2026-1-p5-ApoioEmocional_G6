using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Entities;
using backend.Services;
using backend.Tests.Helpers;

namespace backend.Tests.Services;

public class TokenServiceTests
{
    private readonly TokenService _service = new(JwtTestHelper.CreateConfiguration());

    [Fact]
    public void GenerateToken_ReturnsNonEmptyToken()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Nome = "Test",
            Sobrenome = "User",
            SenhaHash = "hash"
        };

        var token = _service.GenerateToken(user);

        Assert.False(string.IsNullOrWhiteSpace(token));
    }

    [Fact]
    public void GenerateToken_ContainsExpectedClaims()
    {
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = "user@test.com",
            Nome = "Test",
            Sobrenome = "User",
            SenhaHash = "hash"
        };

        var token = _service.GenerateToken(user);
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.Equal(userId.ToString(), jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal("user@test.com", jwt.Claims.First(c => c.Type == ClaimTypes.Email).Value);
    }

    [Fact]
    public void TryGetExpiration_ValidToken_ReturnsTrue()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Nome = "Test",
            Sobrenome = "User",
            SenhaHash = "hash"
        };
        var token = _service.GenerateToken(user);

        var result = _service.TryGetExpiration(token, out var expiration);

        Assert.True(result);
        Assert.True(expiration > DateTimeOffset.UtcNow);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void TryGetExpiration_NullOrEmpty_ReturnsFalse(string? token)
    {
        var result = _service.TryGetExpiration(token!, out var expiration);

        Assert.False(result);
        Assert.Equal(default, expiration);
    }

    [Fact]
    public void TryGetExpiration_BearerPrefix_StripsAndReturnsTrue()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Nome = "Test",
            Sobrenome = "User",
            SenhaHash = "hash"
        };
        var token = _service.GenerateToken(user);

        var result = _service.TryGetExpiration($"Bearer {token}", out var expiration);

        Assert.True(result);
        Assert.True(expiration > DateTimeOffset.UtcNow);
    }

    [Fact]
    public void TryGetExpiration_InvalidToken_ReturnsFalse()
    {
        var result = _service.TryGetExpiration("not-a-valid-jwt", out var expiration);

        Assert.False(result);
        Assert.Equal(default, expiration);
    }

    [Fact]
    public void TryIsExpired_ValidToken_ReturnsFalseForExpired()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Nome = "Test",
            Sobrenome = "User",
            SenhaHash = "hash"
        };
        var token = _service.GenerateToken(user);

        var result = _service.TryIsExpired(token, out var isExpired);

        Assert.True(result);
        Assert.False(isExpired);
    }

    [Fact]
    public void TryIsExpired_InvalidToken_ReturnsFalse()
    {
        var result = _service.TryIsExpired("invalid-token", out var isExpired);

        Assert.False(result);
        Assert.True(isExpired);
    }
}
