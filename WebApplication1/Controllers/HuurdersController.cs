using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HuurdersController
    {

        [ApiController]
        [Route("api/[controller]")]
        public class HuurderController : ControllerBase
        {
            private readonly DatabaseContext _context;

            public HuurderController(DatabaseContext context)
            {
                _context = context;
            }

            [HttpGet("getHuurderInfo")]
          /* public async Task<ActionResult<Huurder>> GetHuurderInfo()
            {
                var huurderId = User.Identity.Name; 
                var huurder = await _context.Huurders.FirstOrDefaultAsync(h => h.UserId == huurderId);

                if (huurder == null)
                {
                    return NotFound();
                }

                return Ok(huurder);
            }
        }

    }
}*/
