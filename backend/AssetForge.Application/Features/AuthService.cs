using AssetForge.Application.DTOs;
using AssetForge.Application.Interfaces.Repositories;

namespace AssetForge.Application.Features
{
    public class AuthService
    {
        private readonly IUserRepository _repo;
        private readonly IJwtRepository _jwt;
        public AuthService(IUserRepository repo, IJwtRepository jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }
        public async Task RegisterAsync(RegisterRequest req)
        {
            var exists = await _repo.GetByEmailAsync(req.Email!);
            if (exists != null)
                throw new Exception("User already exists");
            var user = new Domain.Entities.Users
            {
                Email = req.Email,
                Password = req.Password,
            };
            await _repo.AddAsync(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest req)
        {
            var user = await _repo.GetByEmailAsync(req.Email!);
            if (user == null || user.Password != req.Password)
                throw new Exception("Invalid credentials");

            var token = _jwt.GenerateToken(user.Id, user.Email!, user.Role);

            return new AuthResponse
            {
                Token = token,
                ExpiresIn = 14400 // 4 hours
            };
        }
    }
}
