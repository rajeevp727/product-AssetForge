using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;

namespace AssetForge.Application.Features;

public class GetAllBrandsHandler
{
    private readonly IBrandRepository _repo;

    public GetAllBrandsHandler(IBrandRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<Brands>> Handle()
    {
        return await _repo.GetAllBrandsAsync();
    }
}
