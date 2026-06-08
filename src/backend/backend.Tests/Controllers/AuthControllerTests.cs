using System.Security.Cryptography;
using System.Text;
using backend.Controllers;
using backend.DTOs;
using backend.Entities;
using backend.Services;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests.Controllers;

public class AuthControllerTests : IDisposable
{
    private readonly Data.AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly Mock<IUserOnboardingService> _onboardingMock = new();
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _context = DbContextFactory.Create();
        _tokenService = new TokenService(JwtTestHelper.CreateConfiguration());
        _controller = new AuthController(_context, _tokenService, _onboardingMock.Object);
    }

    public void Dispose() => _context.Dispose();

    [Fact]
    public async Task Register_CreatesUserWithHashedPasswordAndReturnsToken()
    {
        var dto = new RegisterDTO
        {
            Nome = "Pedro",
            Sobrenome = "Dias",
            Email = "pedro@test.com",
            Senha = "senha123"
        };

        var result = await _controller.Register(dto);

        var ok = Assert.IsType<OkObjectResult>(result);
        var user = await _context.Users.FirstAsync();
        Assert.Equal(HashSenha("senha123"), user.SenhaHash);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsTokenAndOnboardingStatus()
    {
        var user = new User
        {
            Nome = "Pedro",
            Sobrenome = "Dias",
            Email = "pedro@test.com",
            SenhaHash = HashSenha("senha123")
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _onboardingMock
            .Setup(s => s.GetByUserIdAsync(user.Id))
            .ReturnsAsync(new UserOnboarding
            {
                UserId = user.Id,
                Goal = "test",
                InitialStatus = backend.Enum.EmotionsEnum.Bom,
                Usage = backend.Enum.UsageFrequencyEnum.Daily,
                Completed = true
            });

        var result = await _controller.Login(new LoginDTO { Email = "pedro@test.com", Senha = "senha123" });

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        var result = await _controller.Login(new LoginDTO { Email = "wrong@test.com", Senha = "wrong" });

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_OnboardingNotCompleted_ReturnsFalse()
    {
        var user = new User
        {
            Nome = "Pedro",
            Sobrenome = "Dias",
            Email = "pedro@test.com",
            SenhaHash = HashSenha("senha123")
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _onboardingMock.Setup(s => s.GetByUserIdAsync(user.Id)).ReturnsAsync((UserOnboarding?)null);

        var result = await _controller.Login(new LoginDTO { Email = "pedro@test.com", Senha = "senha123" });

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public void GetExpiration_ValidToken_ReturnsOk()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Nome = "Test",
            Sobrenome = "User",
            Email = "test@test.com",
            SenhaHash = "hash"
        };
        var token = _tokenService.GenerateToken(user);

        var result = _controller.GetExpiration(token);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public void GetExpiration_InvalidToken_ReturnsBadRequest()
    {
        var result = _controller.GetExpiration("invalid-token");

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequest.Value);
    }

    [Fact]
    public void IsExpired_ValidToken_ReturnsOk()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Nome = "Test",
            Sobrenome = "User",
            Email = "test@test.com",
            SenhaHash = "hash"
        };
        var token = _tokenService.GenerateToken(user);

        var result = _controller.IsExpired(token);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public void IsExpired_InvalidToken_ReturnsBadRequest()
    {
        var result = _controller.IsExpired("invalid-token");

        Assert.IsType<BadRequestObjectResult>(result);
    }

    private static string HashSenha(string senha)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(senha);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
