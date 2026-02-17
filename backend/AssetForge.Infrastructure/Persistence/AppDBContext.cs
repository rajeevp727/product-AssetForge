using AssetForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssetForge.Infrastructure.Persistence
{
    public class AppDBContext : DbContext
    {
        public DbSet<Brands> Brands => Set<Brands>();

        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Brands>(b =>
            {
                b.ToTable("Brands");
                b.HasKey(x => x.Id);
                b.Property(x => x.Name).IsRequired();
            });
        }
    }
}
