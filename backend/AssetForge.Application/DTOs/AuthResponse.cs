namespace AssetForge.Application.DTOs
{
    public class AuthResponse
    {
        public string? Token { get; set; }
        public int ExpiresIn { get; set; }
    }
}
