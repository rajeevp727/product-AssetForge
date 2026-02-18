using AssetForge.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AssetForge.Domain.Entities
{
    public class Users
    {
        public Guid Id { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int Role { get; set; }
        [NotMapped]
        public UserRoles RoleEnum
        {
            get => (UserRoles)Role;
            set => Role = (int)value;
        }
        public bool IsActive { get; set; }
        public int? RequestedRole { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool HasVisitedFromDomain { get; set; }
        public bool HasSeenCta { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }


    }
}
