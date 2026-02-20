using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AssetForge.Application.Features.Auth.Models
{
    public class RefreshRequest
    {
        [Required]
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
