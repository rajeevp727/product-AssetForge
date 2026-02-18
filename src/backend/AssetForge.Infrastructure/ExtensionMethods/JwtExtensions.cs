using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AssetForge.Infrastructure.ExtensionMethods
{
    public static class JwtExtensions
    {
        public static ClaimsPrincipal? GetPrincipalFromExpiredToken(this string token, IConfiguration config)
        {
            if (string.IsNullOrWhiteSpace(token))
                return null;

            var key = config["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new Exception("JWT Key missing in configuration");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                ValidateLifetime = false, // 🔥 allow expired token
                ClockSkew = TimeSpan.Zero
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

                if (securityToken is not JwtSecurityToken jwtToken ||
                    !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                        StringComparison.InvariantCultureIgnoreCase))
                    return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public static Guid? GetUserId(this ClaimsPrincipal principal)
        {
            var id = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return id == null ? null : Guid.Parse(id);
        }

        public static string? GetUserRole(this ClaimsPrincipal principal)
        {
            return principal.FindFirst(ClaimTypes.Role)?.Value;
        }

        public static string? GetEmail(this ClaimsPrincipal principal)
        {
            return principal.FindFirst(ClaimTypes.Email)?.Value;
        }
    }
}
