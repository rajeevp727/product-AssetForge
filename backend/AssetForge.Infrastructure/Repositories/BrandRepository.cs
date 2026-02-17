using AssetForge.Application.Interfaces.Repositories;
using AssetForge.Domain.Entities;
using AssetForge.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AssetForge.Infrastructure.Repositories
{
    public class BrandRepository : IBrandRepository
    {
        private readonly AppDBContext _context;

        public BrandRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<List<Brands>> GetAllBrandsAsync()
        {
            return await _context.Brands.AsNoTracking().OrderBy(b => b.SortOrder).ToListAsync();
        }
    }
}
