using backend.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace backend.Middleware;

// Global exception middleware for consistent error handling and logging.
// It prevents provider failures from surfacing as raw stack traces or malformed responses.
public sealed class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title) = exception switch
        {
            ValidationException => (StatusCodes.Status400BadRequest, "Validation failed"),
            ArgumentException => (StatusCodes.Status400BadRequest, "Invalid request"),
            ProviderNotFoundException => (StatusCodes.Status400BadRequest, "Provider not supported"),
            AIProviderException => (StatusCodes.Status502BadGateway, "AI provider error"),
            OperationCanceledException when context.RequestAborted.IsCancellationRequested => (499, "Request canceled"),
            _ => (StatusCodes.Status500InternalServerError, "Unexpected error")
        };

        _logger.LogError(exception, "Unhandled exception for {Path}", context.Request.Path);

        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        await context.Response.WriteAsJsonAsync(problem);
    }
}
