using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BreathingController : ControllerBase
    {
        private readonly IBreathingService _service;

        public BreathingController(IBreathingService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BreathingRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            await _service.SaveSessionAsync(userId, request);
            return Ok(new { message = "Sessão salva com sucesso!" });
        }
    }
}