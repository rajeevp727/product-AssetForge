using AssetForge.Domain.Enums;

namespace AssetForge.Application.DTOs
{
    public class RegisterRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public UserRoles? RequestedRole { get; set; }
    }
}
