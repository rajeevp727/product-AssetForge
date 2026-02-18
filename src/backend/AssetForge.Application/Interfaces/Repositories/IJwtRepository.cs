namespace AssetForge.Application.Interfaces.Repositories
{
    public interface IJwtRepository
    {
        string GenerateToken(Guid id, string? email, int role);
        string GenerateRefreshToken();
    }
}
