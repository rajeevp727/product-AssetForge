using AssetForge.Application.Features;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetForge.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly GetAllBrandsHandler _handler;
        public BrandsController(GetAllBrandsHandler handler)
        {
            _handler = handler;
        }

        [Authorize(Roles = "Admin, Buyer")]
        [HttpGet("GetAllBrands")]
        public async Task<IActionResult> GetAllBrands()
        {
            var result = await _handler.Handle();
            return Ok(result);
        }
    }
}
