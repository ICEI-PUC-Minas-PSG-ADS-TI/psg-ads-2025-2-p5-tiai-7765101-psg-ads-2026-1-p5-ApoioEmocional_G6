using backend.DTOs;
using backend.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

// Thin REST endpoint for the emotional chat flow.
// All orchestration stays in the application service to keep the controller easy to test.
[ApiController]
[Route("api/chat")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatAssistantService _chatAssistantService;

    public ChatController(IChatAssistantService chatAssistantService)
    {
        _chatAssistantService = chatAssistantService;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponse>> SendMessage([FromBody] ChatRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserIdFromClaims();
        var response = await _chatAssistantService.SendAsync(request, userId, cancellationToken);
        return Ok(response);
    }

    [HttpGet("history")]
    public async Task<ActionResult<ChatHistoryResponse>> GetTodayMessages()
    {
        var userId = GetUserIdFromClaims();
        var response = await _chatAssistantService.GetMessagesAsync(userId);
        return Ok(response);
    }

    private Guid GetUserIdFromClaims()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(idClaim) || !Guid.TryParse(idClaim, out var userId))
            throw new UnauthorizedAccessException("Invalid user");

        return userId;
    }
}
