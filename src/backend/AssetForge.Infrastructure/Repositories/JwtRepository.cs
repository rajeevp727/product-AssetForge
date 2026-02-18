using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;
using AssetForge.Domain.Enums;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AssetForge.Infrastructure.Repositories
{
    public class JwtRepository : IJwtRepository
    {
        private readonly JwtSettings _settings;
        public JwtRepository(IOptions<JwtSettings> options)
        {
            _settings = options.Value;
        }

        public string GenerateToken(Guid id, string? email, int role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roleName = Enum.GetName(typeof(UserRoles), role)!;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Email, email!),
                new Claim(ClaimTypes.Role, roleName)
            };

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(1), // 1 mins
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

    }
}
