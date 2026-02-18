using AssetForge.Domain.Entities;

namespace AssetForge.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<Users?> GetByEmailAsync(string email);
        Task<Users?> GetByIdAsync(Guid Id);
        Task AddAsync(Users user);
        Task UpdateUserAsync(Users users);
    }
}
