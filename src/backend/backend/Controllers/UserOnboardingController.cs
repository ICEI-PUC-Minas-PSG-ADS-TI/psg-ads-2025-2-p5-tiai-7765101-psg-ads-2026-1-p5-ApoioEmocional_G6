using backend.DTOs;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserOnboardingController : ControllerBase
    {
        private readonly IUserOnboardingService _service;

        public UserOnboardingController(IUserOnboardingService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserOnboardingRequestDto request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Os dados de onboarding são inválidos." });
            }

            try 
            {
                // Mapeamento: RequestDto -> Entidade
                var onboarding = new UserOnboarding
                {
                    UserId = request.UserId,
                    Goal = request.Goal,
                    InitialStatus = request.InitialStatus,
                    Usage = request.Usage,
                    Preferences = request.Preferences,
                    CurrentStatus = request.CurrentStatus,
                    Completed = request.Completed
                };

                var createdOnboarding = await _service.CreateAsync(onboarding);
                
                // Mapeamento: Entidade -> ResponseDto
                var response = MapToResponse(createdOnboarding);

                return CreatedAtAction(nameof(GetByUserId), new { userId = response.UserId }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao criar o onboarding.", error = ex.Message });
            }
        }

        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetByUserId(Guid userId)
        {
            var onboarding = await _service.GetByUserIdAsync(userId);
            
            if (onboarding == null)
            {
                return NotFound(new { message = "Dados de onboarding não encontrados para este usuário." });
            }

            // Mapeamento: Entidade -> ResponseDto
            var response = MapToResponse(onboarding);

            return Ok(response);
        }

        [HttpPut("{userId:guid}")]
        public async Task<IActionResult> Update(Guid userId, [FromBody] UserOnboardingRequestDto request)
        {
            if (request == null || userId != request.UserId)
            {
                return BadRequest(new { message = "Os dados são inválidos ou o ID do usuário não corresponde." });
            }

            var existingOnboarding = await _service.GetByUserIdAsync(userId);
            if (existingOnboarding == null)
            {
                return NotFound(new { message = "Onboarding não encontrado para este usuário." });
            }

            try 
            {
                // Mapeamento: Atualizando atributos na Entidade
                existingOnboarding.Goal = request.Goal;
                existingOnboarding.InitialStatus = request.InitialStatus;
                existingOnboarding.Usage = request.Usage;
                existingOnboarding.Preferences = request.Preferences;
                existingOnboarding.CurrentStatus = request.CurrentStatus;
                existingOnboarding.Completed = request.Completed;

                var updatedOnboarding = await _service.UpdateAsync(existingOnboarding);
                
                // Mapeamento: Entidade -> ResponseDto
                var response = MapToResponse(updatedOnboarding);

                return Ok(response);
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "Erro ao atualizar o onboarding.", error = ex.Message });
            }
        }

        // Método auxiliar para não repetir o mapeamento de resposta
        private static UserOnboardingResponseDto MapToResponse(UserOnboarding entity)
        {
            return new UserOnboardingResponseDto
            {
                Id = entity.Id,
                UserId = entity.UserId,
                Goal = entity.Goal,
                InitialStatus = entity.InitialStatus,
                Usage = entity.Usage,
                Preferences = entity.Preferences,
                CurrentStatus = entity.CurrentStatus,
                Completed = entity.Completed
            };
        }
    }
}