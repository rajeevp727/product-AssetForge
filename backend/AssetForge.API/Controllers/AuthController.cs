using AssetForge.Application.DTOs;
using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;
using AssetForge.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetForge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly IJwtRepository _jwt;
        public AuthController(IUserRepository repo, IJwtRepository jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest req)
        {
            var exists = await _repo.GetByEmailAsync(req.Email!);
            if (exists != null)
                return BadRequest("Email already exists.");
            var user = new Users
            {
                Email = req.Email,
                Password = req.Password,
                RoleEnum = UserRoles.User,
                IsActive = true,
                HasVisitedFromDomain = false,
                HasSeenCta = false,
                RequestedRole = req.RequestedRole != null
                ? (int)req.RequestedRole
                : null,
                CreatedAt = DateTime.Now
            };
            await _repo.AddAsync(user);
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _repo.GetByEmailAsync(email);
            if (user == null || user.Password != password)
                return Unauthorized("Invalid credentials.");
            var token = _jwt.GenerateToken(user.Id, user.Email!, user.Role);
            return Ok(new
            {
                token,
                expiresIn = 14400 // 4 hours
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("approve-role/{userId}")]
        public async Task<IActionResult> ApproveUserRoles(Guid Id)
        {
            var user = await _repo.GetByIdAsync(Id);
            if (user != null) return NotFound();

            if (user?.RequestedRole == null) return BadRequest();

            user.Role = user.RequestedRole.Value;
            user.RequestedRole = null;

            await _repo.UpdateUserAsync(user);
            return Ok("Role Approved..");


        }
    }
}
