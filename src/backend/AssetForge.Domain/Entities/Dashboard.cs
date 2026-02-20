using System.Numerics;

namespace AssetForge.Domain.Entities
{
    public class Dashboard
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public long UserBase { get; set; }
        public long Revenue { get; set; }
        public DateTime IncorporatedOn { get; set; }
    }
}