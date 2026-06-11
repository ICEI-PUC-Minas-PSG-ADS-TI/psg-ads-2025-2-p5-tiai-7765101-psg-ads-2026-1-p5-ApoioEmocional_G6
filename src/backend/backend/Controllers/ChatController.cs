using backend.DTOs;
using backend.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// Thin REST endpoint for the emotional chat flow.
// All orchestration stays in the application service to keep the controller easy to test.
[ApiController]
[Route("api/chat")]
public sealed class ChatController : ControllerBase
{
    private readonly IChatAssistantService _chatAssistantService;

    public ChatController(IChatAssistantService chatAssistantService)
    {
        _chatAssistantService = chatAssistantService;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponse>> SendMessage([FromBody] ChatRequest request, CancellationToken cancellationToken)
    {
        var response = await _chatAssistantService.SendAsync(request, cancellationToken);
        return Ok(response);
    }
}
