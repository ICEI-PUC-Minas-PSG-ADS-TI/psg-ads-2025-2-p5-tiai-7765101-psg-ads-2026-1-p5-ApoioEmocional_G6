using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmotionsController : ControllerBase
    {
        private readonly IEmotionService _service;

        public EmotionsController(IEmotionService service)
        {
            _service = service;
        }

        private Guid GetUserIdFromClaims()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(idClaim) || !Guid.TryParse(idClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid user");

            return userId;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EmotionRequest request)
        {
            var userId = GetUserIdFromClaims();
            try
            {
                var result = await _service.RegisterEmotionAsync(request, userId);
                return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(429, new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserIdFromClaims();
            var list = await _service.GetAllAsync(userId);
            return Ok(list);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetToday()
        {
            var userId = GetUserIdFromClaims();
            var list = await _service.GetTodayAsync(userId);
            return Ok(list);
        }

        [HttpGet("week")]
        public async Task<IActionResult> GetWeek()
        {
            var userId = GetUserIdFromClaims();
            var list = await _service.GetThisWeekAsync(userId);
            return Ok(list);
        }
    }
}
