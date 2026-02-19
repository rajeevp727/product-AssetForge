using AssetForge.Application.DTOs;
using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;
using AssetForge.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AssetForge.Infrastructure.ExtensionMethods;
using AssetForge.Application.Features.Auth.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IJwtRepository _jwt;
    private readonly IConfiguration _config;

    public AuthController(IUserRepository repo, IJwtRepository jwt, IConfiguration config)
    {
        _repo = repo;
        _jwt = jwt;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
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
            RequestedRole = req.RequestedRole != null ? (int)req.RequestedRole : null,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(user);
        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _repo.GetByEmailAsync(req.Email!);
        if (user == null || user.Password != req.Password)
            return Unauthorized("Invalid credentials.");

        if (user.Role != 1 && user.Role != 2 && user.Role != 3)
            return StatusCode(403, new
            {
                error = "Your account is not allowed to access the system. Contact administrator."
            });

        var accessToken = _jwt.GenerateToken(user.Id, user.Email!, user.Role);
        var refreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1);

        await _repo.UpdateUserAsync(user);

        return Ok(new AuthResponse
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn = 60 // 1 mins
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("approve-role/{email}")]
    public async Task<IActionResult> ApproveUserRoles(string email)
    {
        var user = await _repo.GetByEmailAsync(email);

        if (user == null)
            return NotFound("User not found.");

        if (user.RequestedRole == null)
            return BadRequest("No role requested.");

        user.Role = user.RequestedRole.Value;
        user.RequestedRole = null;

        await _repo.UpdateUserAsync(user);

        return Ok("Role approved successfully.");
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshRequest request)
    {
        var principal = request.AccessToken!.GetPrincipalFromExpiredToken(_config);
        if (principal == null)
            return BadRequest("Invalid access token");

        var userId = Guid.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _repo.GetByIdAsync(userId);

        if (user == null ||
            user.RefreshToken != request.RefreshToken ||
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return Unauthorized("Invalid refresh token");

        var newAccessToken = _jwt.GenerateToken(user.Id, user.Email!, user.Role);
        var newRefreshToken = _jwt.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1);

        await _repo.UpdateUserAsync(user);

        return Ok(new AuthResponse
        {
            Token = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresIn = 60 // 1 mins
        });
    }
}
