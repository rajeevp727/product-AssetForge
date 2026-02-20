namespace AssetForge.Domain.Entities
{
    public class DashboardResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public long UserBaseRaw { get; set; }
        public string UserBase { get; set; } = "";

        public long RevenueRaw { get; set; }
        public string Revenue { get; set; } = "";

        public DateTime IncorporatedOn { get; set; }
    }
}
