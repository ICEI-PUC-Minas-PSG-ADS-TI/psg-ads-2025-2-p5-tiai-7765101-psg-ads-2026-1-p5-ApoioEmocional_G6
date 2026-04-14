using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using System;
using System.Linq;
using System;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var senhaHash = HashSenha(dto.Senha);

            var usuario = new User
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Sobrenome = dto.Sobrenome,
                SenhaHash = senhaHash
            };

            _context.Users.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuário criado com sucesso");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var senhaHash = HashSenha(dto.Senha);

            var usuario = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == dto.Email &&
                    x.SenhaHash == senhaHash);

            if (usuario == null)
                return Unauthorized("Email ou senha inválidos");

            var token = _tokenService.GenerateToken(usuario);

            return Ok(new { token, usuario.Nome });
        }

        private string HashSenha(string senha)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(senha);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        // GET api/auth/expiration
        // Retorna a data de expiração do token (UTC) e segundos restantes.
        [HttpGet("expiration")]
        public IActionResult GetExpiration([FromQuery] string? token)
        {
            token = ExtractToken(token);

            if (!_tokenService.TryGetExpiration(token ?? string.Empty, out var expiration))
                return BadRequest(new { success = false, message = "Token inválido ou mal formado" });

            var secondsLeft = (expiration - DateTimeOffset.UtcNow).TotalSeconds;

            return Ok(new
            {
                success = true,
                expiration = expiration.UtcDateTime,
                secondsLeft = secondsLeft < 0 ? 0 : (int)Math.Ceiling(secondsLeft)
            });
        }

        // GET api/auth/expired
        // Retorna se o token está expirado (true/false). BadRequest para token mal formado.
        [HttpGet("expired")]
        public IActionResult IsExpired([FromQuery] string? token)
        {
            token = ExtractToken(token);

            if (!_tokenService.TryIsExpired(token ?? string.Empty, out var isExpired))
                return BadRequest(new { success = false, message = "Token inválido ou mal formado" });

            return Ok(new { success = true, expired = isExpired });
        }

        // Helper: extrai token do query ou do header Authorization
        private string? ExtractToken(string? token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(authHeader))
                    return authHeader;
            }

            return token;
        }
    }
}
