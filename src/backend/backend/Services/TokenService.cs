using backend.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User usuario)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email)
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Tenta extrair a data de expiração do token JWT (sem validar assinatura).
        // Retorna true se conseguiu ler a expiração; expiration estará em UTC.
        public bool TryGetExpiration(string token, out DateTimeOffset expiration)
        {
            expiration = default;

            if (string.IsNullOrWhiteSpace(token))
                return false;

            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                token = token.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();

            try
            {
                var jwt = handler.ReadJwtToken(token);

                // JwtSecurityToken.ValidTo is in UTC
                var validToUtc = DateTime.SpecifyKind(jwt.ValidTo, DateTimeKind.Utc);
                expiration = new DateTimeOffset(validToUtc);

                return true;
            }
            catch
            {
                return false;
            }
        }

        // Tenta determinar se o token expirou. Retorna true se foi possível ler o token
        // e out isExpired indica o resultado. Retorna false se o token é inválido/mal formado.
        public bool TryIsExpired(string token, out bool isExpired)
        {
            isExpired = true;

            if (!TryGetExpiration(token, out var expiration))
                return false;

            isExpired = DateTimeOffset.UtcNow > expiration;
            return true;
        }
    }
}
