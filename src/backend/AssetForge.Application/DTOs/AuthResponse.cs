namespace AssetForge.Application.DTOs
{
    public class AuthResponse
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
    }
}
