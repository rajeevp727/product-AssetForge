namespace AssetForge.Domain.Entities
{
    public class Brands
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? Category { get; set; }
        public int Status { get; set; }
        public  int Visibility { get; set; }
        public string? Tags { get; set; }
        public string? DevelopedBy { get; set; }
        public string? OwnedBy { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid CreatorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int SortOrder { get; set; }

    }
}
