using backend.Data;
using backend.Entities;
using backend.Infrastructure.AIProviders;
using backend.Infrastructure.Factories;
using backend.Infrastructure.Interfaces;
using backend.Middleware;
using backend.Repositories;
using backend.Services;
using backend.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Polly;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddOptions<AIOptions>()
    .BindConfiguration("AI");

var aiRetryCount = builder.Configuration.GetValue<int>("AI:RetryCount", 3);
var aiTimeoutSeconds = builder.Configuration.GetValue<int>("AI:TimeoutSeconds", 60);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpClient<OpenAIProvider>((serviceProvider, client) =>
{
    var aiOptions = serviceProvider.GetRequiredService<IOptions<AIOptions>>().Value;
    client.BaseAddress = new Uri(aiOptions.OpenAI.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(aiTimeoutSeconds);
})
.AddPolicyHandler(CreateRetryPolicy(aiRetryCount));

builder.Services.AddHttpClient<GeminiProvider>((serviceProvider, client) =>
{
    var aiOptions = serviceProvider.GetRequiredService<IOptions<AIOptions>>().Value;
    client.BaseAddress = new Uri(aiOptions.Gemini.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(aiTimeoutSeconds);
})
.AddPolicyHandler(CreateRetryPolicy(aiRetryCount));

builder.Services.AddTransient<IAIProvider>(serviceProvider => serviceProvider.GetRequiredService<OpenAIProvider>());
builder.Services.AddTransient<IAIProvider>(serviceProvider => serviceProvider.GetRequiredService<GeminiProvider>());
builder.Services.AddScoped<IAIProviderFactory, AIProviderFactory>();
builder.Services.AddScoped<IChatAssistantService, ChatAssistantService>();
builder.Services.AddScoped<IPromptService, PromptService>();

// Register IHttpContextAccessor for accessing user id in services
builder.Services.AddHttpContextAccessor();

// Token service
builder.Services.AddScoped<TokenService>();

// Repository & Services
builder.Services.AddScoped<IEmotionRepository, EmotionRepository>();
builder.Services.AddScoped<IEmotionService, EmotionService>();
builder.Services.AddScoped<IInsightsService, InsightsService>();
builder.Services.AddScoped<IBreathingRepository, BreathingRepository>();
builder.Services.AddScoped<IBreathingService, BreathingService>();
builder.Services.AddScoped<IUserOnboardingRepository, UserOnboardingRepository>();
builder.Services.AddScoped<IUserOnboardingService, UserOnboardingService>();

// Conversations
builder.Services.AddRepositories();

// Jwt Authentication
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:8080")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static IAsyncPolicy<HttpResponseMessage> CreateRetryPolicy(int retryCount)
{
    return Policy<HttpResponseMessage>
        .Handle<HttpRequestException>()
        .OrResult(response => response.StatusCode == HttpStatusCode.RequestTimeout || (int)response.StatusCode >= 500)
        .WaitAndRetryAsync(retryCount, attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)));
}

