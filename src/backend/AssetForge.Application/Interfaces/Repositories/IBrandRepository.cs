using AssetForge.Domain.Entities;

namespace AssetForge.Application.Interfaces.Repositories
{
    public interface IBrandRepository
    {
        Task<List<Brands>> GetAllBrandsAsync();
    }
}
