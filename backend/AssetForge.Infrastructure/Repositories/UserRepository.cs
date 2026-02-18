using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;
using AssetForge.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AssetForge.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDBContext _context;
        public UserRepository(AppDBContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Users user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<Users?> GetByEmailAsync(string email)
        {
            return await _context.User.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task<Users?> GetByIdAsync(Guid Id)
        {
            return await _context.User.AsNoTracking().FirstAsync(x => x.Id == Id);
        }

        public async Task UpdateUserAsync(Users user)
        {
            var exists = await GetByIdAsync(user.Id);
            if (exists == null) throw new Exception("User not Found");

            exists.Role = user.Role;
            exists.RequestedRole = user.RequestedRole;
            exists.LastLogin = user.LastLogin;
            exists.UpdatedAt = user.UpdatedAt;

            await _context.SaveChangesAsync();
        }
    }
}
